using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entitities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query,string orderBy ){
            if(string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p=>p.Name);

            query =orderBy switch
            {
                "price"=>query.OrderBy(p=>p.Price),
                "pirceDesc"=>query.OrderByDescending(p=>p.Price),
                _=>query.OrderBy(p=>p.Name)

            };
            return query;

        }
        public static IQueryable<Product> Search(this IQueryable<Product> query,string searchTerm ){
            if(string.IsNullOrEmpty(searchTerm)) return query;
            var lowerCaseSearchTerm =searchTerm.Trim().ToLower();
            return query.Where(p=>p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }
        public static IQueryable<Product> Filter(this IQueryable<Product> query,string brands,string types){
            var barndList = new List<string>();
            var typeList = new List<string>();
            if (!string.IsNullOrEmpty(brands))
               barndList.AddRange(brands.ToLower().Split(",").ToList());
            if (!string.IsNullOrEmpty(types))
               typeList.AddRange(types.ToLower().Split(",").ToList());
            query=query.Where(p=>barndList.Count==0||barndList.Contains(p.Brand.ToLower()));
            query=query.Where(p=>typeList.Count==0||typeList.Contains(p.Type.ToLower()));
            return query;      

        }
        
        
    }
}