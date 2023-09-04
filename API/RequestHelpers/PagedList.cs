using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T>:List<T>
    {
        public PagedList(List<T> items,int count,int pageNumber,int pagesize)
        {
            MetaData = new MetaData{
                TotalCount= count,
                PageSize= pagesize,
                CurrentPage=pageNumber,

                TotalPages=(int)Math.Ceiling(count/(double)pagesize)
            };
            AddRange(items);
        }

        public MetaData MetaData { get; set; }


        public static async Task <PagedList<T>> ToPagedList(IQueryable<T> query,int pageNumber,
        int pagesize )
        {
            var count =await query.CountAsync();
            var items =await query.Skip((pageNumber-1)*pagesize).Take(pagesize).ToListAsync();
            return new PagedList<T>(items,count,pageNumber,pagesize ); 
        }
        
    }
}