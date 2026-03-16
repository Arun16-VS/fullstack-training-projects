var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Force HTTPS
app.UseHttpsRedirection();

// Logging Middleware
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    await next();
    Console.WriteLine($"Response Status Code: {context.Response.StatusCode}");
});

// Content Security Policy
app.Use(async (context, next) =>
{
    context.Response.Headers["Content-Security-Policy"] =
        "default-src 'self'; script-src 'self'; style-src 'self';";

    await next();
});

// Error Handling
app.UseExceptionHandler("/error");

// Static Files
app.UseStaticFiles();

// Custom Error Page
app.Map("/error", async context =>
{
    await context.Response.WriteAsync("<h1>Something went wrong!</h1>");
});

app.MapGet("/", () => "Middleware Demo Running...");

app.Run();
