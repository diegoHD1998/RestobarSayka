using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using RestobarSayka.Dtos;
using RestobarSayka.Models;
using RestobarSayka.Models.StoredProcedure;

#nullable disable

namespace RestobarSayka.Data
{
    public partial class AppDbContext : DbContext
    {
        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Boleta> Boleta { get; set; }
        public virtual DbSet<Categoria> Categoria { get; set; }
        public virtual DbSet<Impresora> Impresoras { get; set; }
        public virtual DbSet<Mesa> Mesas { get; set; }
        public virtual DbSet<Modificador> Modificadors { get; set; }
        public virtual DbSet<OpcionModificador> OpcionModificadors { get; set; }
        public virtual DbSet<OpcionVariante> OpcionVariantes { get; set; }
        public virtual DbSet<Pedido> Pedidos { get; set; }
        public virtual DbSet<Producto> Productos { get; set; }
        public virtual DbSet<ProductoModificador> ProductoModificadors { get; set; }
        public virtual DbSet<ProductoPedido> ProductoPedidos { get; set; }
        public virtual DbSet<Rol> Rols { get; set; }
        public virtual DbSet<TipoPago> TipoPagos { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<Variante> Variantes { get; set; }
        public virtual DbSet<Venta> Venta { get; set; }
        public virtual DbSet<Zona> Zonas { get; set; }


        public virtual DbSet<SP_VentasEmpleados> SP_VentasEmpleadoss  { get; set; }
        public virtual DbSet<SP_VentasProducto> SP_VentasProductos  { get; set; }
        public virtual DbSet<SP_VentasProductoSpecific> SP_VentasProductoSpecifics  { get; set; }
        public virtual DbSet<SP_VentasSubTotales>SP_VentasSubTotaless { get; set; }
        public virtual DbSet<SP_VentasTotales>SP_VentasTotaless  { get; set; }
        public virtual DbSet<SP_VentasDelDia>SP_VentasDelDias { get; set; }
        public virtual DbSet<SP_ProductoPedido>SP_Productopedido { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Modern_Spanish_CI_AS");

            modelBuilder.Entity<Boleta>(entity =>
            {
                entity.HasKey(e => e.IdBoleta);

                entity.HasIndex(e => e.BoletaVentaBoletaIdVenta, "IX_FK_BoletaVenta");

                entity.Property(e => e.IdBoleta).HasColumnName("Id_boleta");

                entity.Property(e => e.BoletaVentaBoletaIdVenta).HasColumnName("BoletaVenta_Boleta_Id_venta");

                entity.Property(e => e.FormaDePago).IsRequired();

                entity.HasOne(d => d.BoletaVentaBoletaIdVentaNavigation)
                    .WithMany(p => p.Boleta)
                    .HasForeignKey(d => d.BoletaVentaBoletaIdVenta)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BoletaVenta");
            });

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.IdCategoria);

                entity.HasIndex(e => e.ImpresoraIdImpresora, "IX_FK_ImpresoraCategoria");

                entity.Property(e => e.IdCategoria).HasColumnName("Id_categoria");

                entity.Property(e => e.Color).IsRequired();

                entity.Property(e => e.Descripcion).IsRequired();

                entity.Property(e => e.Estado).IsRequired();

                entity.Property(e => e.ImpresoraIdImpresora).HasColumnName("ImpresoraId_impresora");

                entity.Property(e => e.Nombre).IsRequired();

                entity.Property(e => e.Tipo).IsRequired();

                entity.HasOne(d => d.ImpresoraIdImpresoraNavigation)
                    .WithMany(p => p.Categoria)
                    .HasForeignKey(d => d.ImpresoraIdImpresora)
                    .HasConstraintName("FK_ImpresoraCategoria");
            });

            modelBuilder.Entity<Impresora>(entity =>
            {
                entity.HasKey(e => e.IdImpresora);

                entity.ToTable("Impresora");

                entity.Property(e => e.IdImpresora).HasColumnName("Id_impresora");

                entity.Property(e => e.IpImpresora).HasColumnName("IP_impresora");

                entity.Property(e => e.Nombre).IsRequired();
            });

            modelBuilder.Entity<Mesa>(entity =>
            {
                entity.HasKey(e => e.IdMesa);

                entity.ToTable("Mesa");

                entity.HasIndex(e => e.ZonaIdZona, "IX_FK_MesaZona");

                entity.Property(e => e.IdMesa).HasColumnName("Id_mesa");

                entity.Property(e => e.Nombre).IsRequired();

                entity.Property(e => e.ZonaIdZona).HasColumnName("ZonaId_zona");

                entity.HasOne(d => d.ZonaIdZonaNavigation)
                    .WithMany(p => p.Mesas)
                    .HasForeignKey(d => d.ZonaIdZona)
                    .HasConstraintName("FK_MesaZona");
            });

            modelBuilder.Entity<Modificador>(entity =>
            {
                entity.HasKey(e => e.IdModificador);

                entity.ToTable("Modificador");

                entity.Property(e => e.IdModificador).HasColumnName("Id_modificador");

                entity.Property(e => e.Nombre).IsRequired();
            });

            modelBuilder.Entity<OpcionModificador>(entity =>
            {
                entity.HasKey(e => e.IdOpcionM);

                entity.ToTable("OpcionModificador");

                entity.HasIndex(e => e.ModificadorIdModificador, "IX_FK_ModificadorOpcionModificador");

                entity.Property(e => e.IdOpcionM).HasColumnName("Id_opcionM");

                entity.Property(e => e.ModificadorIdModificador).HasColumnName("ModificadorId_modificador");

                entity.Property(e => e.Nombre).IsRequired();

                entity.HasOne(d => d.ModificadorIdModificadorNavigation)
                    .WithMany(p => p.OpcionModificadors)
                    .HasForeignKey(d => d.ModificadorIdModificador)
                    .HasConstraintName("FK_ModificadorOpcionModificador");
            });

            modelBuilder.Entity<OpcionVariante>(entity =>
            {
                entity.HasKey(e => e.IdOpcionV);

                entity.ToTable("OpcionVariante");

                entity.HasIndex(e => e.VarianteIdVariante, "IX_FK_OpcionVarianteVariante");

                entity.Property(e => e.IdOpcionV).HasColumnName("Id_opcionV");

                entity.Property(e => e.Nombre).IsRequired();

                entity.Property(e => e.VarianteIdVariante).HasColumnName("VarianteId_variante");

                entity.HasOne(d => d.VarianteIdVarianteNavigation)
                    .WithMany(p => p.OpcionVariantes)
                    .HasForeignKey(d => d.VarianteIdVariante)
                    .HasConstraintName("FK_OpcionVarianteVariante");
            });

            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.HasKey(e => e.IdPedido);

                entity.ToTable("Pedido");

                entity.HasIndex(e => e.MesaIdMesa, "IX_FK_PedidoMesa");

                entity.HasIndex(e => e.UsuarioIdUsuario, "IX_FK_PedidoUsuario");

                entity.Property(e => e.IdPedido).HasColumnName("Id_pedido");

                entity.Property(e => e.Estado).IsRequired();

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.MesaIdMesa).HasColumnName("MesaId_mesa");

                entity.Property(e => e.UsuarioIdUsuario).HasColumnName("UsuarioId_usuario");

                entity.HasOne(d => d.MesaIdMesaNavigation)
                    .WithMany(p => p.Pedidos)
                    .HasForeignKey(d => d.MesaIdMesa)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PedidoMesa");

                entity.HasOne(d => d.UsuarioIdUsuarioNavigation)
                    .WithMany(p => p.Pedidos)
                    .HasForeignKey(d => d.UsuarioIdUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PedidoUsuario");

            });

            modelBuilder.Entity<Producto>(entity =>
            {
                entity.HasKey(e => e.IdProducto);

                entity.ToTable("Producto");

                entity.HasIndex(e => e.CategoriaIdCategoria, "IX_FK_ProductoCategoria");

                entity.HasIndex(e => e.VarianteIdVariante, "IX_FK_ProductoVariante");

                entity.Property(e => e.IdProducto).HasColumnName("Id_producto");

                entity.Property(e => e.CategoriaIdCategoria).HasColumnName("CategoriaId_categoria");

                entity.Property(e => e.Estado).IsRequired();

                entity.Property(e => e.Nombre).IsRequired();

                entity.Property(e => e.VarianteIdVariante).HasColumnName("VarianteId_variante");

                entity.HasOne(d => d.CategoriaIdCategoriaNavigation)
                    .WithMany(p => p.Productos)
                    .HasForeignKey(d => d.CategoriaIdCategoria)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProductoCategoria");

                entity.HasOne(d => d.VarianteIdVarianteNavigation)
                    .WithMany(p => p.Productos)
                    .HasForeignKey(d => d.VarianteIdVariante)
                    .HasConstraintName("FK_ProductoVariante");
            });

            modelBuilder.Entity<ProductoModificador>(entity =>
            {
                entity.HasKey(e => new { e.ProductoIdProducto, e.ModificadorIdModificador });

                entity.ToTable("ProductoModificador");

                entity.HasIndex(e => e.ModificadorIdModificador, "IX_FK_ProductoModificador_Modificador");

                entity.Property(e => e.ProductoIdProducto).HasColumnName("Producto_Id_producto");

                entity.Property(e => e.ModificadorIdModificador).HasColumnName("Modificador_Id_modificador");

                entity.HasOne(d => d.ModificadorIdModificadorNavigation)
                    .WithMany(p => p.ProductoModificadors)
                    .HasForeignKey(d => d.ModificadorIdModificador)
                    .HasConstraintName("FK_ProductoModificador_Modificador");

                entity.HasOne(d => d.ProductoIdProductoNavigation)
                    .WithMany(p => p.ProductoModificadors)
                    .HasForeignKey(d => d.ProductoIdProducto)
                    .HasConstraintName("FK_ProductoModificador_Producto");
            });

            modelBuilder.Entity<ProductoPedido>(entity =>
            {

                entity.HasKey(e => e.IdProductoPedido);

                entity.ToTable("ProductoPedido");

                entity.HasIndex(e => e.PedidoIdPedido, "IX_FK_PedidoProductoPedido");

                entity.HasIndex(e => e.ProductoIdProducto, "IX_FK_ProductoProductoPedido");

                entity.Property(e => e.IdProductoPedido).HasColumnName("IdProductoPedido");

                entity.Property(e => e.ProductoIdProducto).HasColumnName("ProductoId_producto");

                entity.Property(e => e.PedidoIdPedido).HasColumnName("PedidoId_pedido");

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.HasOne(d => d.PedidoIdPedidoNavigation)
                    .WithMany(p => p.ProductoPedidos)
                    .HasForeignKey(d => d.PedidoIdPedido)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PedidoProductoPedido");

                entity.HasOne(d => d.ProductoIdProductoNavigation)
                    .WithMany(p => p.ProductoPedidos)
                    .HasForeignKey(d => d.ProductoIdProducto)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProductoProductoPedido");

            });

            modelBuilder.Entity<Rol>(entity =>
            {
                entity.HasKey(e => e.IdRol);

                entity.ToTable("Rol");

                entity.Property(e => e.IdRol).HasColumnName("Id_rol");

                entity.Property(e => e.Nombre).IsRequired();
            });

            modelBuilder.Entity<TipoPago>(entity =>
            {
                entity.HasKey(e => e.IdTipoPago);

                entity.ToTable("TipoPago");

                entity.Property(e => e.IdTipoPago).HasColumnName("Id_tipoPago");

                entity.Property(e => e.Nombre).IsRequired();
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUsuario);

                entity.ToTable("Usuario");

                entity.HasIndex(e => e.RolIdRol, "IX_FK_UsuarioRol");

                entity.Property(e => e.IdUsuario).HasColumnName("Id_usuario");

                entity.Property(e => e.Apellido).IsRequired();

                entity.Property(e => e.Estado).IsRequired();

                entity.Property(e => e.Nombre).IsRequired();

                entity.Property(e => e.Password).IsRequired();

                entity.Property(e => e.RolIdRol).HasColumnName("RolId_rol");

                entity.Property(e => e.UserName).IsRequired();

                entity.HasOne(d => d.RolIdRolNavigation)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.RolIdRol)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UsuarioRol");
            });

            modelBuilder.Entity<Variante>(entity =>
            {
                entity.HasKey(e => e.IdVariante);

                entity.ToTable("Variante");

                entity.Property(e => e.IdVariante).HasColumnName("Id_variante");

                entity.Property(e => e.Nombre).IsRequired();
            });

            modelBuilder.Entity<Venta>(entity =>
            {
                entity.HasKey(e => e.IdVenta);

                entity.HasIndex(e => e.PedidoIdPedido, "IX_FK_VentaPedido");

                entity.HasIndex(e => e.TipoPagoIdTipoPago, "IX_FK_VentaTipoPago");

                entity.HasIndex(e => e.UsuarioIdUsuario, "IX_FK_VentaUsuario");

                entity.Property(e => e.IdVenta).HasColumnName("Id_venta");

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.PedidoIdPedido).HasColumnName("PedidoId_pedido");

                entity.Property(e => e.TipoPagoIdTipoPago).HasColumnName("TipoPagoId_tipoPago");

                entity.Property(e => e.UsuarioIdUsuario).HasColumnName("UsuarioId_usuario");

                entity.HasOne(d => d.PedidoIdPedidoNavigation)
                    .WithMany(p => p.Venta)
                    .HasForeignKey(d => d.PedidoIdPedido)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VentaPedido");

                entity.HasOne(d => d.TipoPagoIdTipoPagoNavigation)
                    .WithMany(p => p.Venta)
                    .HasForeignKey(d => d.TipoPagoIdTipoPago)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VentaTipoPago");

                entity.HasOne(d => d.UsuarioIdUsuarioNavigation)
                    .WithMany(p => p.Venta)
                    .HasForeignKey(d => d.UsuarioIdUsuario)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_VentaUsuario");
            });

            modelBuilder.Entity<Zona>(entity =>
            {
                entity.HasKey(e => e.IdZona);

                entity.ToTable("Zona");

                entity.Property(e => e.IdZona).HasColumnName("Id_zona");

                entity.Property(e => e.Color).IsRequired();

                entity.Property(e => e.Estado).IsRequired();

                entity.Property(e => e.Nombre).IsRequired();
            });


            modelBuilder.Entity<SP_VentasEmpleados>(entity =>
            {
                entity.HasNoKey();

            });

            modelBuilder.Entity<SP_VentasProducto>(entity =>
            {
                entity.HasNoKey();

            });

            modelBuilder.Entity<SP_VentasProductoSpecific>(entity =>
            {
                entity.HasNoKey();

            });

            modelBuilder.Entity<SP_VentasSubTotales>(entity =>
            {
                entity.HasNoKey();

            });

            modelBuilder.Entity<SP_VentasTotales>(entity =>
            {
                entity.HasNoKey();

            });

            modelBuilder.Entity<SP_VentasDelDia>(entity =>
            {
                entity.HasNoKey();
            });

            modelBuilder.Entity<SP_ProductoPedido>(entity =>
            {
                entity.HasNoKey();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
