using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Http;

namespace FormAPI.Controllers
{
    public class MemberController : ApiController
    {
        formEntities1 _ent = new formEntities1();

        // kullanıcının üye olduğu sunucuları listeleyen fonksiyon
        [HttpGet]
        public List<MemberTip> UserServers(int userid)
        {
            return _ent.members.Where(p => p.user_id == userid).Select(p => new MemberTip()
            {
                User_id = p.user_id,
                Server_id = p.server_id,
                Mem_id = p.mem_id
            }).ToList();

        }

        //serverdeki üye listesini getiren fonksiyon
        [HttpGet]
        public List<MemberTip> UyeleriGetir(int serverid)
        {
            return _ent.members.Where(p => p.server_id == serverid).Select(p => new MemberTip()
            {
                User_id = p.user_id,
                Server_id = p.server_id,
                Mem_id = p.mem_id
            }).ToList();
        }

        //server id ye göre silme yapan fonksiyon
        [HttpGet]
        public bool DeleteServer(int serverid)
        {
            try
            {
                List<members> silinecek = _ent.members.Where(p => p.server_id == serverid).ToList();
                _ent.members.RemoveRange(silinecek);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


        //user id ye göre silme yapan fonksiyon
        [HttpGet]
        public bool DeleteUser(int userid)
        {
            try
            {
                List<members> silinecek = _ent.members.Where(p => p.user_id == userid).ToList();
                _ent.members.RemoveRange(silinecek);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        //kullanıcı üyeliğini bitirmek için silme yapan fonksiyon
        [HttpGet]
        public bool DeleteMem(int userid, int serverid)
        {
            try
            {
                List<members> silinecek = _ent.members.Where(p => p.user_id == userid && p.server_id == serverid).ToList();
                _ent.members.RemoveRange(silinecek);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        //sunucuya üye ekleme yapan fonksiyon
        [HttpGet]
        public bool AddMem(int userid, int serverid)
        {
            try
            {
                members s = new members
                {
                    server_id = serverid,
                    user_id = userid
                };
                _ent.members.Add(s);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }




        }

        public class MemberTip
        {
            public int Mem_id { get; set; }
            public int User_id { get; set; }
            public int Server_id { get; set; }
        }
    }
}