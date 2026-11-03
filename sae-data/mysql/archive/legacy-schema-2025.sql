-- Legacy schema-only reference. Not used by current Docker startup.
/*
 Navicat Premium Data Transfer

 Source Server         : redacted
 Source Server Type    : MySQL
 Source Server Version : 80406
 Source Host           : localhost:3306
 Source Schema         : sae_web

 Target Server Type    : MySQL
 Target Server Version : 80406
 File Encoding         : 65001

 Date: 10/09/2025 18:03:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Seleccionar la base de datos
-- La línea USE será reemplazada por el script 00-prepare-sql.sh


-- ----------------------------
-- Table structure for actividad
-- ----------------------------
DROP TABLE IF EXISTS `actividad`;
CREATE TABLE `actividad`  (
  `uuid` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `usuario` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `device` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `tipo` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `entity` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `entity_json` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `entity_uuid` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `sincronizacion` int(0) UNSIGNED NULL DEFAULT 0,
  `created` timestamp(0) NULL DEFAULT NULL,
  `updated` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`uuid`) USING BTREE,
  INDEX `FK_actividad_usuario`(`usuario`) USING BTREE,
  INDEX `device`(`device`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of actividad
-- ----------------------------

-- ----------------------------
-- Table structure for actividad_dispositivo
-- ----------------------------
DROP TABLE IF EXISTS `actividad_dispositivo`;
CREATE TABLE `actividad_dispositivo`  (
  `actividad` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `dispositivo` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  PRIMARY KEY (`actividad`, `dispositivo`) USING BTREE,
  INDEX `fk_dp`(`dispositivo`) USING BTREE,
  CONSTRAINT `fk_ac` FOREIGN KEY (`actividad`) REFERENCES `actividad` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dp` FOREIGN KEY (`dispositivo`) REFERENCES `dispositivo` (`uuid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of actividad_dispositivo
-- ----------------------------

-- ----------------------------
-- Table structure for aux_marca
-- ----------------------------
DROP TABLE IF EXISTS `aux_marca`;
CREATE TABLE `aux_marca`  (
  `id_marca` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `descripcion` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_marca`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 47 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of aux_marca
-- ----------------------------

-- ----------------------------
-- Table structure for cfg_admin_empresa
-- ----------------------------
DROP TABLE IF EXISTS `cfg_admin_empresa`;
CREATE TABLE `cfg_admin_empresa`  (
  `id_admin` bigint(0) NOT NULL AUTO_INCREMENT,
  `empresa` bigint(0) NULL DEFAULT NULL,
  `estado` int(0) NULL DEFAULT 0,
  `info` char(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `fechaAlta` date NULL DEFAULT NULL,
  `fechaBaja` date NULL DEFAULT NULL,
  PRIMARY KEY (`id_admin`) USING BTREE,
  INDEX `fk_admin_empresa`(`empresa`) USING BTREE,
  CONSTRAINT `fk_admin_empresa` FOREIGN KEY (`empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cfg_admin_empresa
-- ----------------------------

-- ----------------------------
-- Table structure for con_entidad
-- ----------------------------
DROP TABLE IF EXISTS `con_entidad`;
CREATE TABLE `con_entidad`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `codigo` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `info` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of con_entidad
-- ----------------------------

-- ----------------------------
-- Table structure for contacto
-- ----------------------------
DROP TABLE IF EXISTS `contacto`;
CREATE TABLE `contacto`  (
  `id_contacto` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `tipo` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `dato` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `info` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_contacto`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1387 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of contacto
-- ----------------------------

-- ----------------------------
-- Table structure for dispositivo
-- ----------------------------
DROP TABLE IF EXISTS `dispositivo`;
CREATE TABLE `dispositivo`  (
  `uuid` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `nombre` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `created` timestamp(0) NULL DEFAULT NULL,
  `updated` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dispositivo
-- ----------------------------

-- ----------------------------
-- Table structure for doc_seguro
-- ----------------------------
DROP TABLE IF EXISTS `doc_seguro`;
CREATE TABLE `doc_seguro`  (
  `id_seguro` bigint(0) NOT NULL AUTO_INCREMENT,
  `empresa` bigint(0) NULL DEFAULT NULL,
  `compania` bigint(0) NULL DEFAULT NULL,
  `poliza` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `desde` date NULL DEFAULT NULL,
  `hasta` date NULL DEFAULT NULL,
  `referencia` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `prima` double(10, 0) NULL DEFAULT 0,
  `monto` double(10, 0) NULL DEFAULT 0,
  `tipo` int(0) NULL DEFAULT 0,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_seguro`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of doc_seguro
-- ----------------------------

-- ----------------------------
-- Table structure for empresa
-- ----------------------------
DROP TABLE IF EXISTS `empresa`;
CREATE TABLE `empresa`  (
  `id_empresa` bigint(0) NOT NULL AUTO_INCREMENT,
  `cuit` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `observacion` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `razon_social` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_empresa`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1154 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of empresa
-- ----------------------------

-- ----------------------------
-- Table structure for empresa_contacto
-- ----------------------------
DROP TABLE IF EXISTS `empresa_contacto`;
CREATE TABLE `empresa_contacto`  (
  `id_empresa` bigint(0) NOT NULL,
  `id_contacto` bigint(0) NOT NULL,
  INDEX `FK_empresa_contacto`(`id_empresa`) USING BTREE,
  INDEX `FK_contacto_empresa`(`id_contacto`) USING BTREE,
  CONSTRAINT `FK_contacto_empresa` FOREIGN KEY (`id_contacto`) REFERENCES `contacto` (`id_contacto`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_empresa_contacto` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of empresa_contacto
-- ----------------------------

-- ----------------------------
-- Table structure for empresa_direccion
-- ----------------------------
DROP TABLE IF EXISTS `empresa_direccion`;
CREATE TABLE `empresa_direccion`  (
  `id_empresa` bigint(0) NOT NULL,
  `id_direccion` bigint(0) NOT NULL,
  INDEX `FK_empresa_rubro`(`id_empresa`) USING BTREE,
  INDEX `FK_rubro_empresa`(`id_direccion`) USING BTREE,
  CONSTRAINT `empresa_direccion_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `empresa_direccion_ibfk_2` FOREIGN KEY (`id_direccion`) REFERENCES `ubi_direccion` (`id_direccion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of empresa_direccion
-- ----------------------------

-- ----------------------------
-- Table structure for empresa_rubro
-- ----------------------------
DROP TABLE IF EXISTS `empresa_rubro`;
CREATE TABLE `empresa_rubro`  (
  `id_empresa` bigint(0) NOT NULL,
  `id_rubro` bigint(0) NOT NULL,
  INDEX `FK_empresa_rubro`(`id_empresa`) USING BTREE,
  INDEX `FK_rubro_empresa`(`id_rubro`) USING BTREE,
  CONSTRAINT `FK_empresa_rubro` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_rubro_empresa` FOREIGN KEY (`id_rubro`) REFERENCES `rubro` (`id_rubro`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of empresa_rubro
-- ----------------------------

-- ----------------------------
-- Table structure for eq_categoria
-- ----------------------------
DROP TABLE IF EXISTS `eq_categoria`;
CREATE TABLE `eq_categoria`  (
  `id_categoria` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  PRIMARY KEY (`id_categoria`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_categoria
-- ----------------------------

-- ----------------------------
-- Table structure for eq_compra_venta
-- ----------------------------
DROP TABLE IF EXISTS `eq_compra_venta`;
CREATE TABLE `eq_compra_venta`  (
  `id_compra_venta` bigint(0) NOT NULL AUTO_INCREMENT,
  `fecha_compra` datetime(0) NULL DEFAULT NULL,
  `vendedor` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `valor_compra` double NULL DEFAULT NULL,
  `fecha_venta` datetime(0) NULL DEFAULT NULL,
  `comprador` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `valor_venta` double NULL DEFAULT NULL,
  `otro` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  PRIMARY KEY (`id_compra_venta`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 177 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_compra_venta
-- ----------------------------

-- ----------------------------
-- Table structure for eq_documentacion
-- ----------------------------
DROP TABLE IF EXISTS `eq_documentacion`;
CREATE TABLE `eq_documentacion`  (
  `id_doc` bigint(0) NOT NULL AUTO_INCREMENT,
  `uuid` char(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `rutaVto` date NULL DEFAULT NULL,
  `tecnicaVto` date NULL DEFAULT NULL,
  `patenteVto` date NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `seguro` bigint(0) NULL DEFAULT NULL,
  `historial` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_doc`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 136 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_documentacion
-- ----------------------------

-- ----------------------------
-- Table structure for eq_equipo
-- ----------------------------
DROP TABLE IF EXISTS `eq_equipo`;
CREATE TABLE `eq_equipo`  (
  `id_equipo` bigint(0) NOT NULL AUTO_INCREMENT,
  `categoria` bigint(0) NULL DEFAULT NULL,
  `tipo` bigint(0) NULL DEFAULT NULL,
  `modelo` bigint(0) NULL DEFAULT NULL,
  `marca` bigint(0) NULL DEFAULT NULL,
  `anio` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `chasis` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `motor` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `patente` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `color` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `info` char(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `empresa` bigint(0) NULL DEFAULT 0,
  `nombre` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `compra_venta` bigint(0) NULL DEFAULT NULL,
  `gasoil` tinyint(1) NULL DEFAULT 0,
  `estado` tinyint(1) NULL DEFAULT 1,
  `documentacion` bigint(0) NULL DEFAULT NULL,
  `seguro` bigint(0) NULL DEFAULT -1,
  `chofer` bigint(0) NULL DEFAULT -1,
  PRIMARY KEY (`id_equipo`) USING BTREE,
  INDEX `FK_equipo_categoria`(`categoria`) USING BTREE,
  INDEX `FK_equipo_tipo`(`tipo`) USING BTREE,
  INDEX `FK_equipo_modelo`(`modelo`) USING BTREE,
  INDEX `FK_equipo_marca`(`marca`) USING BTREE,
  INDEX `FK_equipo_compra_venta`(`compra_venta`) USING BTREE,
  INDEX `FK_equipo_empresa`(`empresa`) USING BTREE,
  INDEX `FK_equipo_documentacion`(`documentacion`) USING BTREE,
  INDEX `FK_equipo_seguro`(`seguro`) USING BTREE,
  INDEX `FK_equipo_chofer`(`chofer`) USING BTREE,
  CONSTRAINT `FK_equipo_categoria` FOREIGN KEY (`categoria`) REFERENCES `eq_categoria` (`id_categoria`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_equipo_chofer` FOREIGN KEY (`chofer`) REFERENCES `rh_empleado` (`id_empleado`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_equipo_compra_venta` FOREIGN KEY (`compra_venta`) REFERENCES `eq_compra_venta` (`id_compra_venta`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_equipo_documentacion` FOREIGN KEY (`documentacion`) REFERENCES `eq_documentacion` (`id_doc`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_equipo_empresa` FOREIGN KEY (`empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_equipo_marca` FOREIGN KEY (`marca`) REFERENCES `aux_marca` (`id_marca`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_equipo_modelo` FOREIGN KEY (`modelo`) REFERENCES `eq_modelo` (`id_modelo`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_equipo_seguro` FOREIGN KEY (`seguro`) REFERENCES `doc_seguro` (`id_seguro`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_equipo_tipo` FOREIGN KEY (`tipo`) REFERENCES `eq_tipo` (`id_tipo`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 150 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_equipo
-- ----------------------------

-- ----------------------------
-- Table structure for eq_gasto
-- ----------------------------
DROP TABLE IF EXISTS `eq_gasto`;
CREATE TABLE `eq_gasto`  (
  `id_gasto` bigint(0) NOT NULL AUTO_INCREMENT,
  `fecha` date NULL DEFAULT NULL,
  `equipo` bigint(0) NULL DEFAULT NULL,
  `kms` double(255, 0) NULL DEFAULT NULL,
  `codigo` char(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `dtype` varchar(31) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_gasto`) USING BTREE,
  INDEX `FK_gasto_equipo`(`equipo`) USING BTREE,
  CONSTRAINT `FK_gasto_equipo` FOREIGN KEY (`equipo`) REFERENCES `eq_equipo` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 250 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_gasto
-- ----------------------------

-- ----------------------------
-- Table structure for eq_gasto_gasoil
-- ----------------------------
DROP TABLE IF EXISTS `eq_gasto_gasoil`;
CREATE TABLE `eq_gasto_gasoil`  (
  `id_gasto` bigint(0) NULL DEFAULT NULL,
  `id_gasoil` bigint(0) NOT NULL AUTO_INCREMENT,
  `movimineto` int(0) NULL DEFAULT NULL,
  `litros` double NULL DEFAULT NULL,
  `precio` double NULL DEFAULT NULL,
  `stock` double NULL DEFAULT NULL,
  `stock_update` tinyint(1) NULL DEFAULT NULL,
  PRIMARY KEY (`id_gasoil`) USING BTREE,
  INDEX `fk_gasto_gasoil`(`id_gasto`) USING BTREE,
  CONSTRAINT `fk_gasto_gasoil` FOREIGN KEY (`id_gasto`) REFERENCES `eq_gasto` (`id_gasto`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 336 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_gasto_gasoil
-- ----------------------------

-- ----------------------------
-- Table structure for eq_gasto_neumatico
-- ----------------------------
DROP TABLE IF EXISTS `eq_gasto_neumatico`;
CREATE TABLE `eq_gasto_neumatico`  (
  `id_gasto` bigint(0) NULL DEFAULT NULL,
  `id_neumatico` bigint(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `posicion` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_neumatico`) USING BTREE,
  INDEX `FK`(`id_gasto`) USING BTREE,
  CONSTRAINT `fk_neumatico_producto` FOREIGN KEY (`id_gasto`) REFERENCES `eq_gasto` (`id_gasto`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for eq_gasto_repuesto
-- ----------------------------
DROP TABLE IF EXISTS `eq_gasto_repuesto`;
CREATE TABLE `eq_gasto_repuesto`  (
  `id_gasto` bigint(0) NULL DEFAULT NULL,
  `id_repuesto` bigint(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo_alt` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_repuesto`) USING BTREE,
  INDEX `FK`(`id_gasto`) USING BTREE,
  CONSTRAINT `eq_gasto_repuesto_ibfk_1` FOREIGN KEY (`id_gasto`) REFERENCES `eq_gasto` (`id_gasto`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for eq_gasto_taller
-- ----------------------------
DROP TABLE IF EXISTS `eq_gasto_taller`;
CREATE TABLE `eq_gasto_taller`  (
  `id_gasto` bigint(0) NULL DEFAULT NULL,
  `id_taller` bigint(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo_alt` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_taller`) USING BTREE,
  INDEX `FK`(`id_gasto`) USING BTREE,
  CONSTRAINT `eq_gasto_taller_ibfk_1` FOREIGN KEY (`id_gasto`) REFERENCES `eq_gasto` (`id_gasto`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for eq_modelo
-- ----------------------------
DROP TABLE IF EXISTS `eq_modelo`;
CREATE TABLE `eq_modelo`  (
  `id_modelo` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `descripcion` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `anio` int(0) NULL DEFAULT 0,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `id_tipo` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_modelo`) USING BTREE,
  INDEX `FK_modelo_tipo`(`id_tipo`) USING BTREE,
  CONSTRAINT `FK_modelo_tipo` FOREIGN KEY (`id_tipo`) REFERENCES `eq_tipo` (`id_tipo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 80 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_modelo
-- ----------------------------

-- ----------------------------
-- Table structure for eq_repuesto_stock_detalle
-- ----------------------------
DROP TABLE IF EXISTS `eq_repuesto_stock_detalle`;
CREATE TABLE `eq_repuesto_stock_detalle`  (
  `id_stock` bigint(0) NOT NULL AUTO_INCREMENT,
  `fecha` datetime(0) NULL DEFAULT NULL,
  `detalle` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `cantidad` double(11, 0) NULL DEFAULT NULL,
  `repuesto` bigint(0) NULL DEFAULT NULL,
  `equipo` bigint(0) NULL DEFAULT NULL,
  `usuario` bigint(0) NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `estado` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_stock`) USING BTREE,
  INDEX `FK_stock_repuesto`(`repuesto`) USING BTREE,
  INDEX `FK_stock_equipo`(`equipo`) USING BTREE,
  CONSTRAINT `FK_stock_equipo` FOREIGN KEY (`equipo`) REFERENCES `eq_equipo` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_stock_repuesto` FOREIGN KEY (`repuesto`) REFERENCES `ped_repuesto` (`id_repuesto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 336 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_repuesto_stock_detalle
-- ----------------------------

-- ----------------------------
-- Table structure for eq_tipo
-- ----------------------------
DROP TABLE IF EXISTS `eq_tipo`;
CREATE TABLE `eq_tipo`  (
  `id_tipo` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '-',
  `id_categoria` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_tipo`) USING BTREE,
  INDEX `FK_tipo_categoria`(`id_categoria`) USING BTREE,
  CONSTRAINT `FK_tipo_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `eq_categoria` (`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 100 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_tipo
-- ----------------------------

-- ----------------------------
-- Table structure for eq_transporte
-- ----------------------------
DROP TABLE IF EXISTS `eq_transporte`;
CREATE TABLE `eq_transporte`  (
  `id_transporte` bigint(0) NOT NULL AUTO_INCREMENT,
  `id_camion` bigint(0) NULL DEFAULT NULL,
  `id_acopaldo` bigint(0) NULL DEFAULT NULL,
  `id_chofer` bigint(0) NULL DEFAULT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT '',
  `info` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT '',
  `estado` tinyint(1) NULL DEFAULT 1,
  PRIMARY KEY (`id_transporte`) USING BTREE,
  UNIQUE INDEX `fk_acoplado`(`id_acopaldo`) USING BTREE,
  UNIQUE INDEX `fk_cohofer`(`id_chofer`) USING BTREE,
  UNIQUE INDEX `ff_camoin`(`id_camion`) USING BTREE,
  CONSTRAINT `ff_camoin` FOREIGN KEY (`id_camion`) REFERENCES `eq_equipo` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_acoplado` FOREIGN KEY (`id_acopaldo`) REFERENCES `eq_equipo` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of eq_transporte
-- ----------------------------

-- ----------------------------
-- Table structure for evento
-- ----------------------------
DROP TABLE IF EXISTS `evento`;
CREATE TABLE `evento`  (
  `uuid` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `fecha` timestamp(0) NULL DEFAULT NULL,
  `nombre` char(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for item
-- ----------------------------
DROP TABLE IF EXISTS `item`;
CREATE TABLE `item`  (
  `uuid` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `codigo` char(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `unidad` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `marca` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `created` timestamp(0) NULL DEFAULT NULL,
  `updated` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`uuid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of item
-- ----------------------------

-- ----------------------------
-- Table structure for ped_pedido
-- ----------------------------
DROP TABLE IF EXISTS `ped_pedido`;
CREATE TABLE `ped_pedido`  (
  `id_pedido` bigint(0) NOT NULL AUTO_INCREMENT,
  `id_repuesto` bigint(0) NULL DEFAULT NULL,
  `cantidad` double(11, 0) NULL DEFAULT NULL,
  `estado` int(0) NULL DEFAULT NULL,
  `fecha_fin` datetime(0) NULL DEFAULT NULL,
  `fecha_inicio` datetime(0) NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `id_empresa` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_pedido`) USING BTREE,
  INDEX `FK_pedido_empresa`(`id_empresa`) USING BTREE,
  INDEX `FK_pedido_repuesto`(`id_repuesto`) USING BTREE,
  CONSTRAINT `FK_pedido_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_pedido_repuesto` FOREIGN KEY (`id_repuesto`) REFERENCES `ped_repuesto` (`id_repuesto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 439 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ped_pedido
-- ----------------------------

-- ----------------------------
-- Table structure for ped_repuesto
-- ----------------------------
DROP TABLE IF EXISTS `ped_repuesto`;
CREATE TABLE `ped_repuesto`  (
  `id_repuesto` bigint(0) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `stock` double(11, 0) NULL DEFAULT NULL,
  `marca` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `parte` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_repuesto`) USING BTREE,
  INDEX `FK`(`parte`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1356 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ped_repuesto
-- ----------------------------

-- ----------------------------
-- Table structure for ped_repuesto_empresa
-- ----------------------------
DROP TABLE IF EXISTS `ped_repuesto_empresa`;
CREATE TABLE `ped_repuesto_empresa`  (
  `id_empresa` bigint(0) NOT NULL,
  `id_repuesto` bigint(0) NOT NULL,
  INDEX `FK_empresa_repuesto`(`id_empresa`) USING BTREE,
  INDEX `FK_repuesto_empresa`(`id_repuesto`) USING BTREE,
  CONSTRAINT `FK_empresa_repuesto` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_repuesto_empresa` FOREIGN KEY (`id_repuesto`) REFERENCES `ped_repuesto` (`id_repuesto`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ped_repuesto_empresa
-- ----------------------------

-- ----------------------------
-- Table structure for ped_repuesto_eq_modelo
-- ----------------------------
DROP TABLE IF EXISTS `ped_repuesto_eq_modelo`;
CREATE TABLE `ped_repuesto_eq_modelo`  (
  `id_modelo` bigint(0) NOT NULL,
  `id_repuesto` bigint(0) NOT NULL,
  INDEX `FK_empresa_repuesto`(`id_modelo`) USING BTREE,
  INDEX `FK_repuesto_empresa`(`id_repuesto`) USING BTREE,
  CONSTRAINT `FK_modelo` FOREIGN KEY (`id_modelo`) REFERENCES `eq_modelo` (`id_modelo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_repuesto` FOREIGN KEY (`id_repuesto`) REFERENCES `ped_repuesto` (`id_repuesto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ped_repuesto_eq_modelo
-- ----------------------------

-- ----------------------------
-- Table structure for ped_repuesto_equipo
-- ----------------------------
DROP TABLE IF EXISTS `ped_repuesto_equipo`;
CREATE TABLE `ped_repuesto_equipo`  (
  `id_repuesto` bigint(0) NULL DEFAULT NULL,
  `id_equipo` bigint(0) NULL DEFAULT NULL,
  INDEX `FK_repuesto_equipo`(`id_repuesto`) USING BTREE,
  INDEX `FK_equipo_repuesto`(`id_equipo`) USING BTREE,
  CONSTRAINT `FK_equipo_repuesto` FOREIGN KEY (`id_equipo`) REFERENCES `eq_equipo` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_repuesto_equipo` FOREIGN KEY (`id_repuesto`) REFERENCES `ped_repuesto` (`id_repuesto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ped_repuesto_marca
-- ----------------------------
DROP TABLE IF EXISTS `ped_repuesto_marca`;
CREATE TABLE `ped_repuesto_marca`  (
  `id_repuesto` bigint(0) NULL DEFAULT NULL,
  `id_marca` bigint(0) NULL DEFAULT NULL,
  INDEX `FK_repuesto_equipo`(`id_repuesto`) USING BTREE,
  INDEX `FK_equipo_repuesto`(`id_marca`) USING BTREE,
  CONSTRAINT `ped_repuesto_marca_ibfk_1` FOREIGN KEY (`id_marca`) REFERENCES `aux_marca` (`id_marca`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ped_repuesto_marca_ibfk_2` FOREIGN KEY (`id_repuesto`) REFERENCES `ped_repuesto` (`id_repuesto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for pro_neumatico
-- ----------------------------
DROP TABLE IF EXISTS `pro_neumatico`;
CREATE TABLE `pro_neumatico`  (
  `id_neumatico` bigint(0) NOT NULL AUTO_INCREMENT,
  `medida` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `info` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_neumatico`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for pro_presentacion
-- ----------------------------
DROP TABLE IF EXISTS `pro_presentacion`;
CREATE TABLE `pro_presentacion`  (
  `id_presentacion` bigint(0) NOT NULL,
  `nombre` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `codigo` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `valor` double(10, 0) NULL DEFAULT 1,
  `info` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_presentacion`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for pro_producto
-- ----------------------------
DROP TABLE IF EXISTS `pro_producto`;
CREATE TABLE `pro_producto`  (
  `id_producto` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `codigo` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `marca` bigint(0) NULL DEFAULT NULL,
  `info` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `presentacion` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_producto`) USING BTREE,
  INDEX `pro_producto_presentacion_fk`(`presentacion`) USING BTREE,
  CONSTRAINT `pro_producto_presentacion_fk` FOREIGN KEY (`presentacion`) REFERENCES `pro_presentacion` (`id_presentacion`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for pro_producto_empresa
-- ----------------------------
DROP TABLE IF EXISTS `pro_producto_empresa`;
CREATE TABLE `pro_producto_empresa`  (
  `id_producto` bigint(0) NOT NULL,
  `id_empresa` bigint(0) NOT NULL,
  INDEX `pro_producto_marca_fk01`(`id_producto`) USING BTREE,
  INDEX `pro_producto_marca_fk02`(`id_empresa`) USING BTREE,
  CONSTRAINT `pro_producto_empresa_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `pro_producto` (`id_producto`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `pro_producto_empresa_ibfk_2` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for pro_producto_marca
-- ----------------------------
DROP TABLE IF EXISTS `pro_producto_marca`;
CREATE TABLE `pro_producto_marca`  (
  `id_producto` bigint(0) NOT NULL,
  `id_marca` bigint(0) NOT NULL,
  INDEX `pro_producto_marca_fk01`(`id_producto`) USING BTREE,
  INDEX `pro_producto_marca_fk02`(`id_marca`) USING BTREE,
  CONSTRAINT `pro_producto_marca_fk01` FOREIGN KEY (`id_producto`) REFERENCES `pro_producto` (`id_producto`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `pro_producto_marca_fk02` FOREIGN KEY (`id_marca`) REFERENCES `aux_marca` (`id_marca`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for rh_categoria
-- ----------------------------
DROP TABLE IF EXISTS `rh_categoria`;
CREATE TABLE `rh_categoria`  (
  `id_categoria` bigint(0) NOT NULL,
  `nombre` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_categoria`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of rh_categoria
-- ----------------------------

-- ----------------------------
-- Table structure for rh_empleado
-- ----------------------------
DROP TABLE IF EXISTS `rh_empleado`;
CREATE TABLE `rh_empleado`  (
  `id_persona` bigint(0) NULL DEFAULT NULL,
  `id_empleado` bigint(0) NOT NULL AUTO_INCREMENT,
  `categoria` bigint(0) NULL DEFAULT NULL,
  `puesto` bigint(0) NULL DEFAULT NULL,
  `fecha_alta` date NULL DEFAULT NULL,
  `fecha_baja` date NULL DEFAULT NULL,
  `info` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'Activo',
  `empresa` bigint(0) NULL DEFAULT NULL,
  `seguro` bigint(0) NULL DEFAULT -1,
  PRIMARY KEY (`id_empleado`) USING BTREE,
  INDEX `FK_empleado_categoria`(`categoria`) USING BTREE,
  INDEX `FK_empleado_puesto`(`puesto`) USING BTREE,
  INDEX `FK_rh_empleado_empresa`(`empresa`) USING BTREE,
  INDEX `FK_empleado_persona`(`id_persona`) USING BTREE,
  INDEX `FK_empleado_seguro`(`seguro`) USING BTREE,
  CONSTRAINT `FK_empleado_categoria` FOREIGN KEY (`categoria`) REFERENCES `rh_categoria` (`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_empleado_persona` FOREIGN KEY (`id_persona`) REFERENCES `rh_persona` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_empleado_puesto` FOREIGN KEY (`puesto`) REFERENCES `rh_puesto` (`id_puesto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_empleado_seguro` FOREIGN KEY (`seguro`) REFERENCES `doc_seguro` (`id_seguro`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_rh_empleado_empresa` FOREIGN KEY (`empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 27 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of rh_empleado
-- ----------------------------

-- ----------------------------
-- Table structure for rh_familia
-- ----------------------------
DROP TABLE IF EXISTS `rh_familia`;
CREATE TABLE `rh_familia`  (
  `id_persona` bigint(0) NULL DEFAULT NULL,
  `id_familia` bigint(0) NOT NULL AUTO_INCREMENT,
  `pariente` bigint(0) NULL DEFAULT NULL,
  `relacion` enum('Esposo/a','Hijo/a','Padre','Madre','Abuelo/a','Otro') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_familia`) USING BTREE,
  INDEX `fk_familia_persona`(`id_persona`) USING BTREE,
  INDEX `fk_familia_pariente`(`pariente`) USING BTREE,
  CONSTRAINT `fk_familia_pariente` FOREIGN KEY (`pariente`) REFERENCES `rh_persona` (`id_persona`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_familia_persona` FOREIGN KEY (`id_persona`) REFERENCES `rh_persona` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of rh_familia
-- ----------------------------

-- ----------------------------
-- Table structure for rh_persona
-- ----------------------------
DROP TABLE IF EXISTS `rh_persona`;
CREATE TABLE `rh_persona`  (
  `id_persona` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` char(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `apellido` char(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '',
  `nacimiento` date NULL DEFAULT NULL,
  `dni` char(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT '',
  `cuil` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `genero` int(0) NULL DEFAULT 0,
  `estado_civil` int(0) NULL DEFAULT 0,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `domicilio` bigint(0) NULL DEFAULT NULL,
  `estado` int(0) NULL DEFAULT 0,
  `hijo` int(0) NULL DEFAULT 0,
  `dtype` varchar(31) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_persona`) USING BTREE,
  INDEX `FK_rh_persona_domicilio`(`domicilio`) USING BTREE,
  CONSTRAINT `FK_rh_persona_domicilio` FOREIGN KEY (`domicilio`) REFERENCES `ubi_direccion` (`id_direccion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 38 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of rh_persona
-- ----------------------------

-- ----------------------------
-- Table structure for rh_persona_contacto
-- ----------------------------
DROP TABLE IF EXISTS `rh_persona_contacto`;
CREATE TABLE `rh_persona_contacto`  (
  `id_persona` bigint(0) NULL DEFAULT NULL,
  `id_contacto` bigint(0) NULL DEFAULT NULL,
  INDEX `FK_rh_persona_contacto`(`id_persona`) USING BTREE,
  INDEX `FK_contacto_rh_persona`(`id_contacto`) USING BTREE,
  CONSTRAINT `FK_contacto_rh_persona` FOREIGN KEY (`id_contacto`) REFERENCES `contacto` (`id_contacto`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_rh_persona_contacto` FOREIGN KEY (`id_persona`) REFERENCES `rh_persona` (`id_persona`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of rh_persona_contacto
-- ----------------------------

-- ----------------------------
-- Table structure for rh_puesto
-- ----------------------------
DROP TABLE IF EXISTS `rh_puesto`;
CREATE TABLE `rh_puesto`  (
  `id_puesto` bigint(0) NOT NULL,
  `nombre` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_puesto`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of rh_puesto
-- ----------------------------

-- ----------------------------
-- Table structure for rh_vacacion
-- ----------------------------
DROP TABLE IF EXISTS `rh_vacacion`;
CREATE TABLE `rh_vacacion`  (
  `id_vacacion` bigint(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fecha` date NULL DEFAULT NULL,
  `empleado` bigint(0) NULL DEFAULT NULL,
  `detalle` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `dias` int(0) NULL DEFAULT NULL,
  `anio` int(0) UNSIGNED NULL DEFAULT NULL,
  `fecha_toma` date NULL DEFAULT NULL,
  `fecha_liquida` date NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NULL DEFAULT NULL,
  `created` timestamp(0) NULL DEFAULT NULL,
  `updated` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_vacacion`) USING BTREE,
  INDEX `fk_vacacion_empleado`(`empleado`) USING BTREE,
  CONSTRAINT `fk_vacacion_empleado` FOREIGN KEY (`empleado`) REFERENCES `rh_empleado` (`id_persona`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 191 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of rh_vacacion
-- ----------------------------

-- ----------------------------
-- Table structure for rubro
-- ----------------------------
DROP TABLE IF EXISTS `rubro`;
CREATE TABLE `rubro`  (
  `id_rubro` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `codigo` int(0) NULL DEFAULT NULL,
  `descripcion` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_rubro`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 139 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of rubro
-- ----------------------------

-- ----------------------------
-- Table structure for rubro_sub
-- ----------------------------
DROP TABLE IF EXISTS `rubro_sub`;
CREATE TABLE `rubro_sub`  (
  `id_sub` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `codigo` int(0) NULL DEFAULT NULL,
  `descripcion` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `rubro` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_sub`) USING BTREE,
  INDEX `rubro_sub_rubro`(`rubro`) USING BTREE,
  CONSTRAINT `rubro_sub_rubro` FOREIGN KEY (`rubro`) REFERENCES `rubro` (`id_rubro`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ubi_coordenada
-- ----------------------------
DROP TABLE IF EXISTS `ubi_coordenada`;
CREATE TABLE `ubi_coordenada`  (
  `id_coordenada` bigint(0) NOT NULL,
  `info` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `latitud` double NULL DEFAULT NULL,
  `longitud` double NULL DEFAULT NULL,
  `poly` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `id_direccion` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_coordenada`) USING BTREE,
  INDEX `FK_coordena_direccion`(`id_direccion`) USING BTREE,
  CONSTRAINT `FK_coordena_direccion` FOREIGN KEY (`id_direccion`) REFERENCES `ubi_direccion` (`id_direccion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for ubi_direccion
-- ----------------------------
DROP TABLE IF EXISTS `ubi_direccion`;
CREATE TABLE `ubi_direccion`  (
  `id_direccion` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `calle` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `numero` varchar(6) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `codigo` varchar(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `info` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `localidad` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_direccion`) USING BTREE,
  INDEX `FK_direccion_localidad`(`localidad`) USING BTREE,
  CONSTRAINT `FK_direccion_localidad` FOREIGN KEY (`localidad`) REFERENCES `ubi_localidad` (`id_localidad`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1235 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ubi_direccion
-- ----------------------------

-- ----------------------------
-- Table structure for ubi_localidad
-- ----------------------------
DROP TABLE IF EXISTS `ubi_localidad`;
CREATE TABLE `ubi_localidad`  (
  `id_localidad` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `codigo_postal` varchar(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `provincia` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_localidad`) USING BTREE,
  INDEX `FK_localidad_provincia`(`provincia`) USING BTREE,
  CONSTRAINT `FK_localidad_provincia` FOREIGN KEY (`provincia`) REFERENCES `ubi_provincia` (`id_provincia`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 111 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ubi_localidad
-- ----------------------------

-- ----------------------------
-- Table structure for ubi_provincia
-- ----------------------------
DROP TABLE IF EXISTS `ubi_provincia`;
CREATE TABLE `ubi_provincia`  (
  `id_provincia` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  `codigo` char(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_provincia`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 100 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ubi_provincia
-- ----------------------------

-- ----------------------------
-- Table structure for usr_grupo
-- ----------------------------
DROP TABLE IF EXISTS `usr_grupo`;
CREATE TABLE `usr_grupo`  (
  `id_grupo` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `code` int(0) NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_grupo`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usr_grupo
-- ----------------------------

-- ----------------------------
-- Table structure for usr_menu
-- ----------------------------
DROP TABLE IF EXISTS `usr_menu`;
CREATE TABLE `usr_menu`  (
  `id_menu` bigint(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `code` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id_menu`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usr_menu
-- ----------------------------

-- ----------------------------
-- Table structure for usr_role
-- ----------------------------
DROP TABLE IF EXISTS `usr_role`;
CREATE TABLE `usr_role`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usr_role
-- ----------------------------

-- ----------------------------
-- Table structure for usr_user
-- ----------------------------
DROP TABLE IF EXISTS `usr_user`;
CREATE TABLE `usr_user`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `password` varchar(120) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `username` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `UKr43af9ap4edm43mmtq01oddj6`(`username`) USING BTREE,
  UNIQUE INDEX `UK6dotkott2kjsp8vw4d0m25fb7`(`email`) USING BTREE,
  UNIQUE INDEX `UKlkdax67exu02awh2drsmn1v8b`(`username`) USING BTREE,
  UNIQUE INDEX `UKbs3jibaamf7sxnjt6xgwvfkmn`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usr_user
-- ----------------------------

-- ----------------------------
-- Table structure for usr_user_role
-- ----------------------------
DROP TABLE IF EXISTS `usr_user_role`;
CREATE TABLE `usr_user_role`  (
  `user_id` bigint(0) NOT NULL,
  `role_id` int(0) NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE,
  INDEX `FKh8ciramu9cc9q3qcqiv4ue8a6`(`role_id`) USING BTREE,
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `usr_role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `usr_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usr_user_role
-- ----------------------------

-- ----------------------------
-- Table structure for usr_usuario
-- ----------------------------
DROP TABLE IF EXISTS `usr_usuario`;
CREATE TABLE `usr_usuario`  (
  `id_usuario` bigint(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `password` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `grupo` bigint(0) NULL DEFAULT NULL,
  `info` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `estado` enum('Activo','Inactivo') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT 'Activo',
  PRIMARY KEY (`id_usuario`) USING BTREE,
  INDEX `FK_usuario_grupo`(`grupo`) USING BTREE,
  CONSTRAINT `FK_usuario_grupo` FOREIGN KEY (`grupo`) REFERENCES `usr_grupo` (`id_grupo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usr_usuario
-- ----------------------------

-- ----------------------------
-- Table structure for usr_usuario_menu
-- ----------------------------
DROP TABLE IF EXISTS `usr_usuario_menu`;
CREATE TABLE `usr_usuario_menu`  (
  `id_usuario` bigint(0) NOT NULL,
  `id_menu` bigint(0) NOT NULL,
  INDEX `FK_persona_familia`(`id_usuario`) USING BTREE,
  INDEX `FK_familia_persona`(`id_menu`) USING BTREE,
  CONSTRAINT `FK_menu_usuario` FOREIGN KEY (`id_menu`) REFERENCES `usr_menu` (`id_menu`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_usuario_menu` FOREIGN KEY (`id_usuario`) REFERENCES `usr_usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usr_usuario_menu
-- ----------------------------

-- ----------------------------
-- View structure for equipo_view
-- ----------------------------
DROP VIEW IF EXISTS `equipo_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `equipo_view` AS select `eq_equipo`.`tipo` AS `tipo`,`eq_equipo`.`modelo` AS `modelo`,`eq_equipo`.`marca` AS `marca`,`eq_equipo`.`anio` AS `anio`,`eq_equipo`.`patente` AS `patente`,`eq_equipo`.`motor` AS `motor`,`eq_equipo`.`chasis` AS `chasis` from `eq_equipo` order by `eq_equipo`.`tipo`;

SET FOREIGN_KEY_CHECKS = 1;
