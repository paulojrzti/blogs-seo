export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_ORIGIN: string;
}

const randomState = () => crypto.randomUUID();

function popupHTML(status: 'success' | 'error', payload: unknown, origin: string) {
  const msg = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Decap OAuth</title></head><body>
<script>
(function () {
  function receive(e) {
    if (e.origin !== ${JSON.stringify(origin)}) return;
    window.opener.postMessage(${JSON.stringify(msg)}, e.origin);
    window.removeEventListener('message', receive, false);
    window.close();
  }
  window.addEventListener('message', receive, false);
  window.opener && window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;
}

function htmlResponse(body: string, status = 200, extra: HeadersInit = {}) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...extra },
  });
}

function getCookie(req: Request, name: string): string | undefined {
  const cookies = (req.headers.get('Cookie') ?? '').split(';');
  for (const raw of cookies) {
    const [k, ...rest] = raw.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return undefined;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === '/auth') {
      const state = randomState();
      const gh = new URL('https://github.com/login/oauth/authorize');
      gh.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      gh.searchParams.set('redirect_uri', `${url.origin}/callback`);
      gh.searchParams.set('scope', 'repo,user');
      gh.searchParams.set('state', state);

      return new Response(null, {
        status: 302,
        headers: {
          Location: gh.toString(),
          'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
        },
      });
    }

    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const cookieState = getCookie(req, 'oauth_state');

      if (!code || !state || state !== cookieState) {
        return htmlResponse(
          popupHTML('error', { message: 'invalid_state' }, env.ALLOWED_ORIGIN),
          400,
        );
      }

      const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'decap-oauth-worker',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = (await tokenResp.json()) as { access_token?: string; error?: string };

      if (!data.access_token) {
        return htmlResponse(
          popupHTML(
            'error',
            { message: data.error ?? 'token_exchange_failed' },
            env.ALLOWED_ORIGIN,
          ),
          400,
        );
      }

      return htmlResponse(
        popupHTML(
          'success',
          { token: data.access_token, provider: 'github' },
          env.ALLOWED_ORIGIN,
        ),
        200,
        { 'Set-Cookie': 'oauth_state=; Path=/; Max-Age=0' },
      );
    }

    if (url.pathname === '/health') return new Response('ok');

    return new Response('Decap OAuth broker — rotas: /auth, /callback', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
