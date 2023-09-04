using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace API.Middleware
{
    public class ExceptionMiddleWare
    {
        
       
        public RequestDelegate _next { get; }
        public ILogger<ExceptionMiddleWare> _logger { get; }
        private readonly IHostEnvironment _env;
                
        public ExceptionMiddleWare(RequestDelegate next,ILogger<ExceptionMiddleWare> logger,
        IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
            
        }
        // must have this function
        public async Task InvokeAsync(HttpContext context) 
        {
           try
           {
            await _next(context);
           }
           catch (Exception ex)
           {
            
            _logger.LogError(ex,ex.Message);
            context.Response.ContentType="application/json";
            context.Response.StatusCode=500;
           

            var Response =new ProblemDetails
            {
                Status=500,
                Detail=_env.IsDevelopment()?ex.StackTrace?.ToString():null,
                Title=ex.Message
            };
            //serialize json
            var options =new JsonSerializerOptions{PropertyNamingPolicy=JsonNamingPolicy.CamelCase};
            var json =JsonSerializer.Serialize(Response,options);
            await context.Response.WriteAsync(json);
           }
        }
        
    }
}
