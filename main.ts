import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

const TARGET_HOST = "http://39.99.230.211";

serve(async (req: Request) => {
	const url = new URL(req.url);

	// 构建目标URL
	const targetUrl = `${TARGET_HOST}${url.pathname}${url.search}`;

	// 复制并修改请求头
	const headers = new Headers(req.headers);
	headers.set("host", new URL(TARGET_HOST).host);  // 关键：同步目标域名[1](@ref)

	// 转发请求
	const response = await fetch(targetUrl, {
		method: req.method,
		headers,
		body: req.body
	});

	// 处理响应头
	const proxyHeaders = new Headers(response.headers);
	proxyHeaders.set("access-control-allow-origin", "*");  // 解决跨域问题[1](@ref)

	return new Response(response.body, {
		status: response.status,
		headers: proxyHeaders
	});
}, { port: 8000 });

console.log("Proxy server running at http://localhost:8000");