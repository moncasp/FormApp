//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace FormAPI
{
    using System;
    using System.Collections.Generic;
    
    public partial class msgs
    {
        public int msg_id { get; set; }
        public string msg_content { get; set; }
        public int msg_server { get; set; }
        public int msg_author { get; set; }
        public Nullable<System.DateTime> msg_date { get; set; }
    
        public virtual servers servers { get; set; }
        public virtual users users { get; set; }
    }
}
