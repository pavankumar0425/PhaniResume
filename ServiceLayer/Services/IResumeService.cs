using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using webapi.proxies.Models;

namespace ServiceLayer.Services
{
    public interface IResumeService
    {
        List<ResumeDetail> GetAllResumeDetailsByCustomer();

        CustomerDetail GetcustomerByCustomer(int customerId);
    }
}
