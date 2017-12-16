using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webapi.proxies.Clients;
using webapi.proxies.Interfaces;
using webapi.proxies.Models;

namespace ServiceLayer.Services
{
    public class ResumeService : IResumeService
    {
        public List<ResumeDetail> GetAllResumeDetailsByCustomer(int cutomerId)
        {
            try
            {
                using (var client=new PhaniResumeClient())
                {
                    return client.GetAllResumeDetailsByCustomer(cutomerId);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }


        public CustomerDetail GetcustomerByCustomer(int customerId)
        {
            try
            {
                using (var client = new PhaniResumeClient())
                {
                    return client.GetcustomerByCustomer(customerId);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

    }
}
