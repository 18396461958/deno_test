// 使用Deno内置的serve函数，这是当前推荐的方式
const TARGET_HOST = "http://39.99.230.211";

// 使用Deno.serve API (Deno 1.30+)
Deno.serve({ port: 8000 }, async (req: Request) => {
	const url = new URL(req.url);

	// 构建目标URL
	const targetUrl = `${TARGET_HOST}${url.pathname}${url.search}`;

	// 复制并修改请求头
	const headers = new Headers(req.headers);
	headers.set("host", new URL(TARGET_HOST).host);

	try {
		// 转发请求
		const response = await fetch(targetUrl, {
			method: req.method,
			headers,
			body: req.body
		});

		// 处理响应头
		const proxyHeaders = new Headers(response.headers);
		proxyHeaders.set("access-control-allow-origin", "*");
		proxyHeaders.set("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
		proxyHeaders.set("access-control-allow-headers", "*");

		// 处理OPTIONS预检请求
		if (req.method === "OPTIONS") {
			return new Response(null, {
				status: 200,
				headers: proxyHeaders
			});
		}

		return new Response(response.body, {
			status: response.status,
			headers: proxyHeaders
		});
	} catch (error) {
		console.error("Proxy error:", error);
		return new Response("Proxy Error", { status: 500 });
	}
});

console.log("Proxy server running at http://localhost:8000");