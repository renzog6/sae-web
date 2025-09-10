/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 100137
 Source Host           : localhost:3306
 Source Schema         : lima_limon

 Target Server Type    : MySQL
 Target Server Version : 100137
 File Encoding         : 65001

 Date: 20/07/2023 10:43:03
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _marcatoproveedor
-- ----------------------------
DROP TABLE IF EXISTS `_marcatoproveedor`;
CREATE TABLE `_marcatoproveedor`  (
  `A` int(11) NOT NULL,
  `B` int(11) NOT NULL,
  UNIQUE INDEX `_MarcaToProveedor_AB_unique`(`A`, `B`) USING BTREE,
  INDEX `_MarcaToProveedor_B_index`(`B`) USING BTREE,
  CONSTRAINT `_MarcaToProveedor_A_fkey` FOREIGN KEY (`A`) REFERENCES `marcas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_MarcaToProveedor_B_fkey` FOREIGN KEY (`B`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for cajas
-- ----------------------------
DROP TABLE IF EXISTS `cajas`;
CREATE TABLE `cajas`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` enum('Efectivo','Electronico','Otra') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Efectivo',
  `nombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `saldo` double NOT NULL DEFAULT 0,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `fechaApertura` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaCierre` datetime(3) NULL DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cajas
-- ----------------------------
INSERT INTO `cajas` VALUES (1, 'Efectivo', 'Efectivo', 0, 1, '2023-01-01 03:00:00.000', NULL, '2023-07-20 12:53:40.420', '2023-07-20 12:53:40.420');
INSERT INTO `cajas` VALUES (2, 'Electronico', 'Electronico', 0, 1, '2023-01-01 03:00:00.000', NULL, '2023-07-20 12:53:40.420', '2023-07-20 12:53:40.420');

-- ----------------------------
-- Table structure for cajas_movimientos
-- ----------------------------
DROP TABLE IF EXISTS `cajas_movimientos`;
CREATE TABLE `cajas_movimientos`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo` enum('Pago','Cobro','Iterno_Pago','intero_Cobro') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `importe` double NOT NULL DEFAULT 0,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `cajaId` int(11) NULL DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `cajas_movimientos_cajaId_fkey`(`cajaId`) USING BTREE,
  CONSTRAINT `cajas_movimientos_cajaId_fkey` FOREIGN KEY (`cajaId`) REFERENCES `cajas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for categorias
-- ----------------------------
DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of categorias
-- ----------------------------
INSERT INTO `categorias` VALUES (1, 'Textil - 250ml', 'Test', 1);
INSERT INTO `categorias` VALUES (2, 'Difusor - 500ml', 'Test', 1);
INSERT INTO `categorias` VALUES (3, 'Sahumerio - x 6u', 'Test', 1);

-- ----------------------------
-- Table structure for clientes
-- ----------------------------
DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telefono` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `saldo` double NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `clientes_email_key`(`email`) USING BTREE,
  UNIQUE INDEX `clientes_telefono_key`(`telefono`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of clientes
-- ----------------------------
INSERT INTO `clientes` VALUES (1, 'Vale - Lima Limon', 'Para uso Interno', 1, NULL, NULL, 0);
INSERT INTO `clientes` VALUES (2, 'Cliente 22', 'Test', 1, NULL, NULL, 0);

-- ----------------------------
-- Table structure for cobros
-- ----------------------------
DROP TABLE IF EXISTS `cobros`;
CREATE TABLE `cobros`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `clienteId` int(11) NOT NULL,
  `ventaId` int(11) NULL DEFAULT NULL,
  `movimientoId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `cobros_movimientoId_key`(`movimientoId`) USING BTREE,
  INDEX `cobros_clienteId_fkey`(`clienteId`) USING BTREE,
  INDEX `cobros_ventaId_fkey`(`ventaId`) USING BTREE,
  CONSTRAINT `cobros_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `cobros_movimientoId_fkey` FOREIGN KEY (`movimientoId`) REFERENCES `cajas_movimientos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `cobros_ventaId_fkey` FOREIGN KEY (`ventaId`) REFERENCES `ventas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for compras
-- ----------------------------
DROP TABLE IF EXISTS `compras`;
CREATE TABLE `compras`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime(3) NOT NULL,
  `total` double NOT NULL DEFAULT 0,
  `saldo` double NOT NULL DEFAULT 0,
  `proveedorId` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Compra_proveedorId_fkey`(`proveedorId`) USING BTREE,
  CONSTRAINT `Compra_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for marcas
-- ----------------------------
DROP TABLE IF EXISTS `marcas`;
CREATE TABLE `marcas`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of marcas
-- ----------------------------
INSERT INTO `marcas` VALUES (1, 'Saphirus', '', 1);
INSERT INTO `marcas` VALUES (2, 'AMBAR', '', 1);
INSERT INTO `marcas` VALUES (3, 'Test', 'Test', 1);

-- ----------------------------
-- Table structure for pagos
-- ----------------------------
DROP TABLE IF EXISTS `pagos`;
CREATE TABLE `pagos`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `proveedorId` int(11) NOT NULL,
  `compraId` int(11) NULL DEFAULT NULL,
  `movimientoId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `pagos_movimientoId_key`(`movimientoId`) USING BTREE,
  INDEX `pagos_proveedorId_fkey`(`proveedorId`) USING BTREE,
  INDEX `pagos_compraId_fkey`(`compraId`) USING BTREE,
  CONSTRAINT `pagos_compraId_fkey` FOREIGN KEY (`compraId`) REFERENCES `compras` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pagos_movimientoId_fkey` FOREIGN KEY (`movimientoId`) REFERENCES `cajas_movimientos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pagos_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for pedidos
-- ----------------------------
DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cantidad` int(11) NOT NULL,
  `precio` double NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime(3) NOT NULL,
  `productoId` int(11) NOT NULL,
  `ventaId` int(11) NULL DEFAULT NULL,
  `compraId` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Pedido_productoId_fkey`(`productoId`) USING BTREE,
  INDEX `pedidos_ventaId_fkey`(`ventaId`) USING BTREE,
  INDEX `pedidos_compraId_fkey`(`compraId`) USING BTREE,
  CONSTRAINT `pedidos_compraId_fkey` FOREIGN KEY (`compraId`) REFERENCES `compras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pedidos_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pedidos_ventaId_fkey` FOREIGN KEY (`ventaId`) REFERENCES `ventas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for productos
-- ----------------------------
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `precio` double NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime(3) NOT NULL,
  `marcaId` int(11) NOT NULL,
  `categoriaId` int(11) NOT NULL,
  `proveedorId` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `productos_marcaId_fkey`(`marcaId`) USING BTREE,
  INDEX `productos_categoriaId_fkey`(`categoriaId`) USING BTREE,
  INDEX `productos_proveedorId_fkey`(`proveedorId`) USING BTREE,
  CONSTRAINT `productos_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categorias` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `productos_marcaId_fkey` FOREIGN KEY (`marcaId`) REFERENCES `marcas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `productos_proveedorId_fkey` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of productos
-- ----------------------------
INSERT INTO `productos` VALUES (1, 'Cacao 11', 'Test', 500, 6, 1, '2023-07-20 12:53:40.472', '2023-07-20 12:53:40.472', 1, 1, 1);
INSERT INTO `productos` VALUES (2, 'Limon 33', 'Test', 900, 9, 1, '2023-07-20 12:53:40.472', '2023-07-20 12:53:40.472', 2, 2, 1);
INSERT INTO `productos` VALUES (3, 'Bambu 55', 'Test', 300, 15, 1, '2023-07-20 12:53:40.472', '2023-07-20 12:53:40.472', 1, 3, 1);

-- ----------------------------
-- Table structure for proveedores
-- ----------------------------
DROP TABLE IF EXISTS `proveedores`;
CREATE TABLE `proveedores`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `telefono` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `saldo` double NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `proveedores_email_key`(`email`) USING BTREE,
  UNIQUE INDEX `proveedores_telefono_key`(`telefono`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of proveedores
-- ----------------------------
INSERT INTO `proveedores` VALUES (1, 'Vale - Lima Limon', 'Para uso Interno', 1, NULL, NULL, 0);
INSERT INTO `proveedores` VALUES (2, 'Proveedor 33', 'Test', 1, NULL, NULL, 0);

-- ----------------------------
-- Table structure for ventas
-- ----------------------------
DROP TABLE IF EXISTS `ventas`;
CREATE TABLE `ventas`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `estado` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime(3) NOT NULL,
  `total` double NOT NULL DEFAULT 0,
  `saldo` double NOT NULL DEFAULT 0,
  `clienteId` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `Venta_clienteId_fkey`(`clienteId`) USING BTREE,
  CONSTRAINT `Venta_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
