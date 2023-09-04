using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Entitities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        public UserManager<User> _userManager { get; }
        public IConfiguration _config { get; }
        public TokenService(UserManager<User> userManager,IConfiguration config)
        {
            _config = config;
            _userManager = userManager;

            
        }
        public async Task<string> GenerateToken(User user)
        {
            var Claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Name,user.UserName)
            };
            var roles = await _userManager.GetRolesAsync(user);
            foreach(var role in roles)
            {
                Claims.Add(new Claim(ClaimTypes.Role,role));
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));

            var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha512);

            var tokenOptions = new JwtSecurityToken(
                issuer: null,
                audience:null,
                claims:Claims,
                expires:DateTime.Now.AddDays(7),
                signingCredentials:creds


            );
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);

        }
    }
}