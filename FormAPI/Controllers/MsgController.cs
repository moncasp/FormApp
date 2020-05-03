using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace FormAPI.Controllers
{
    public class MsgController : ApiController
    {
        formEntities1 _ent = new formEntities1();


        //Bir sunucudaki mesajları getiren fonksiyon
        [HttpGet]
        public List<MsgTip> ServerMsgList(int serverid)
        {
            return _ent.msgs.Where(p=>p.msg_server == serverid).Select(p => new MsgTip()
            {
                Msg_id=p.msg_id,
                Msg_content=p.msg_content,
                Msg_author=p.msg_author,
                Msg_date=p.msg_date.ToString(),
            }).ToList();
        }

        //sunucudaki bir mesajı silme
        [HttpGet]
        public bool MsgDelete(int msgid)
        {
            try
            {
                List<msgs> silinecek = _ent.msgs.Where(p => p.msg_id == msgid).ToList();
                _ent.msgs.RemoveRange(silinecek);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        //servere göre mesaj silme
        [HttpGet]
        public bool DeleteServerMsg(int serverid)
        {
            try
            {
                List<msgs> silinecek = _ent.msgs.Where(p => p.msg_server == serverid).ToList();
                _ent.msgs.RemoveRange(silinecek);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception) { return false; }
        }

        //sunucuya mesaj ekleme
        [HttpGet]
        public bool AddMsg (string icerik, int server,int yazar)
        {
            try
            {
                msgs s = new msgs
                {
                    msg_content = icerik,
                    msg_author = yazar,
                    msg_server = server,
                    msg_date =DateTime.Now
                    
                };
                _ent.msgs.Add(s);
                _ent.SaveChanges();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }


    }

    public class MsgTip
    {
        public int Msg_id { get; set; }
        public string Msg_content { get; set; }
        public int Msg_server { get; set; }
        public string Msg_date { get; set; }
        public int Msg_author { get; set; }

    }
}