using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
namespace FormAPI.Controllers
{
    public class UsersController : ApiController
    {
        formEntities1 _ent = new formEntities1();
        ServerController Sc = new ServerController();
        MemberController Mc = new MemberController();

        //login işlemi için kullanıcı adı ve parola kontrolü yapan fonksiyon
        [HttpGet]
        public int LoginKontrol(string name, string pass)
        {
            users k= _ent.users.FirstOrDefault(p => p.user_name == name && p.user_pass == pass);
            if (k == null)
            {
                return -1;
            }
            else
            {
                return k.user_id;
            }
        }

        //tüm kullanıcıları listeleyen fonksiyon
        [HttpGet]
        public List<UsersTip> UserList()
        {
            return _ent.users.Select(p=>new UsersTip() {
            
            User_id=p.user_id,
            User_name=p.user_name,
            User_authority=p.user_authority,
            User_registerDate=p.user_registerDate.ToString()
            }).ToList();
        }
        

        //kullanıcı ismi daha önce alınmışmı kontrol eden fonksiyon
        [HttpGet]
        public bool İsimkontrol (string name)
        {
            return _ent.users.Any(p => p.user_name == name);
        }


        //Kullanıcı ekleyen fonksiyon
        [HttpGet]
        public bool UserKayit(string name, string pass, string yetki)
        {
            users Eklenecek = new users
            {
                user_name = name,
                user_pass = pass,
                user_authority = yetki,
                user_registerDate = DateTime.Now,
            };


            _ent.users.Add(Eklenecek);
            _ent.SaveChanges();
            return true;    //kayıt başarılı
        }

        //kullanıcı bilgilerini id ye göre sorgulama 
        [HttpGet]
        public List<UsersTip> UserInfo(int userid)
        {
            return _ent.users.Where(p => p.user_id == userid).Select(p => new UsersTip()
            {
                User_id = p.user_id,
                User_name = p.user_name,
                User_authority = p.user_authority,
                User_registerDate = p.user_registerDate.ToString()
            }).ToList();
        }

        //kullanıcı bilgilerini isme göre sorgulama 
        [HttpGet]
        public List<UsersTip> UsernameInfo(string username)
        {
            return _ent.users.Where(p => p.user_name == username).Select(p => new UsersTip()
            {
                User_id = p.user_id,
                User_name = p.user_name,
                User_authority = p.user_authority,
                User_registerDate = p.user_registerDate.ToString()
            }).ToList();
        }

        //kullanıcı silme fonksiyonu
        [HttpGet]
        public bool KullaniciSil (int id)
        {
            try
            {
                List<users> silinecek = _ent.users.Where(p => p.user_id == id).ToList();
                foreach (users item in silinecek)
                {
                    Mc.DeleteUser(item.user_id);    //kullanıcının bütün üyelikleri siliniyor
                    Sc.ServerAdminDelete(item.user_id); //kullanıcının bütün sunucuları siliniyor
                }
                _ent.users.RemoveRange(silinecek);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
            
        }



    }
    public class UsersTip
    {
        public int User_id { get; set; }
        public string User_name { get; set; }
        public string User_pass { get; set; }
        public string User_authority { get; set; }
        public string User_registerDate { get; set; }

    }
}