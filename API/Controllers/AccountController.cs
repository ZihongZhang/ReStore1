using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entitities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        public TokenService _tokenService { get; }
        public StoreContext _context { get; }
        public AccountController(UserManager<User> userManager,TokenService tokenService,StoreContext context)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user =await _userManager.FindByNameAsync(loginDto.UserName);

            if(user== null || !await _userManager.CheckPasswordAsync(user,loginDto.Password))
            return Unauthorized();
            
            var userBasket = await RetrieveBasket(loginDto.UserName);
            // if(userBasket==null)
            // {
            //     userBasket = CreateBasket();
            //     userBasket.BuyerId=user.UserName;
            //     await _context.SaveChangesAsync();
            // }

            var annonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);
            if(annonBasket!= null)
            {
                if(userBasket!=null)_context.Baskets.Remove(annonBasket);
                annonBasket.BuyerId=user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
                
            }

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket =annonBasket!=null?annonBasket.MapBasketToDto():userBasket?.MapBasketToDto()
            };

        }

        [HttpPost("register")]
        public async Task<ActionResult>Register(RegisterDto registerDto)
        {
            var user=new User{UserName=registerDto.UserName,Email=registerDto.Email};
            var result= await _userManager.CreateAsync(user,registerDto.Password);
            if(!result.Succeeded)
            {
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code,error.Description);
                }
                return ValidationProblem();
            }
            await _userManager.AddToRoleAsync(user,"Member");
            return StatusCode(201);

        }

        [Authorize]  
        [HttpGet("currentUser")]

        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token=await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
                
            };


        }
        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            return await _userManager.Users
            .Where(x=>x.UserName==User.Identity.Name)
            .Select(x=>x.Address)
            .FirstOrDefaultAsync();
        }
        
        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId)) {
                Response.Cookies.Delete("buyerId");
                return null;}
            return await _context.Baskets
                        .Include(i => i.Items)
                        .ThenInclude(p => p.Product)
                        .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }
        private Basket CreateBasket()
        {
            var buyerId=User.Identity?.Name ;
            if(string.IsNullOrEmpty(buyerId)) {
                buyerId=Guid.NewGuid().ToString();
            var cookieOptions =new CookieOptions{
                IsEssential=true,Expires=DateTime.Now.AddDays(30)
            };
            Response.Cookies.Append("buyerId",buyerId,cookieOptions);
            }
            var basket = new Basket{BuyerId=buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }


    }
}