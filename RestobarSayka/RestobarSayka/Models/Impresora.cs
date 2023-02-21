using System;
using System.Collections.Generic;

#nullable disable

namespace RestobarSayka.Models
{
    public partial class Impresora
    {
        public Impresora()
        {
            Categoria = new HashSet<Categoria>();
        }

        public int IdImpresora { get; set; }
        public string IpImpresora { get; set; }
        public string Nombre { get; set; }

        public virtual ICollection<Categoria> Categoria { get; set; }
    }
}
