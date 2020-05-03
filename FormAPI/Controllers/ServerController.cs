using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace FormAPI.Controllers
{
    public class ServerController : ApiController
    {
        formEntities1 _ent = new formEntities1();
        MsgController Mc = new MsgController();
        MemberController MemCont = new MemberController();

        //tüm serverleri getirecek olan fonksiyon
        [HttpGet]
        public List<ServerTip> ServerList()
        {
            return _ent.servers.Select(p => new ServerTip()
            {
                Server_id = p.server_id,
                Server_name = p.server_name,
                Server_size = p.server_size,
                Server_admin = p.server_admin,
                Server_description = p.server_description
            }).ToList();
        }


        //server id ye göre server bilgilerinin sorgulanacağı fonksiyon
        [HttpGet]
        public List<ServerTip> ServerInfo(int id)
        {
            return _ent.servers.Where(p => p.server_id == id).Select(p => new ServerTip()
            {
                Server_id = p.server_id,
                Server_name = p.server_name,
                Server_size = p.server_size,
                Server_admin = p.server_admin,
                Server_description = p.server_description
            }).ToList();
        }

        // sadece bir kullanıcının admin olduğu serverleri getirecek olan fonksiyon
        [HttpGet]
        public List<ServerTip> AdminServerList(int userid)
        {
            return _ent.servers.Where(p=> p.server_admin == userid).Select(p => new ServerTip()
            {
                Server_id = p.server_id,
                Server_name = p.server_name,
                Server_size = p.server_size,
                Server_admin = p.server_admin,
                Server_description = p.server_description
            }).ToList();
        }

        //server admin id ye göre server silme fonksiyonu
        [HttpGet]
        public bool ServerAdminDelete(int userid)
        {
            try
            {
                List<servers> silinecek = _ent.servers.Where(p => p.server_admin == userid).ToList();
                foreach (servers item in silinecek)
                {
                    Mc.DeleteServerMsg(item.server_id);
                }
                _ent.servers.RemoveRange(silinecek);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        //server id ye göre server silme fonksiyonu
        [HttpGet]
        public bool ServerDelete(int serverid)
        {
            try
            {
                List<servers> silinecek = _ent.servers.Where(p => p.server_id == serverid).ToList();
                foreach(servers item in silinecek)
                {
                    Mc.DeleteServerMsg(item.server_id); //serverdeki bütün mesajlar siliniyor
                    MemCont.DeleteServer(item.server_id);// servirdeki bütün üyeliklerde siliniyor 
                }
                _ent.servers.RemoveRange(silinecek);
                _ent.SaveChanges();
                return true;
            }
            catch(Exception)
            {
                return false;
            }
        }

        //server ekleme fonksiyonu
        [HttpGet]
        public bool ServerAdd(string name,int size, int admin ,string tanim)
        {
            try
            {
                servers info = new servers
                {
                    server_admin = admin,
                    server_description = tanim,
                    server_name = name,
                    server_size = size
                };
                _ent.servers.Add(info);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }

    public class ServerTip
    {
        public int Server_id { get; set; }
        public string Server_name { get; set; }
        public int Server_size { get; set; }
        public int Server_admin { get; set; }
        public string Server_description { get; set; }
    }
}