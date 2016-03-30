Ext.define('Planche.dbms.mysql', function() {

    var queries = {
        SELECT_ALL_USER         : 'SELECT * FROM `mysql`.`user`',
        SELECT_USER             : 'SELECT * FROM `mysql`.`user` WHERE user="{0}" AND host="{1}"',
        SELECT_COUNT            : 'SELECT COUNT(1) as cnt FROM `{0}`.`{1}`',
        CREATE_USER             : 'CREATE USER `{0}`@`{1}` IDENTIFIED BY "{2}"',
        DELETE_USER             : 'DROP USER `{0}`@`{1}`',
        GRANT                   : 'GRANT {0} ON {3} TO `{1}`@`{2}` {4}',
        REVOKE                  : 'REVOKE {0} ON {3} FROM `{1}`@`{2}`',
        RENAME_USER             : 'RENAME USER `{0}`@`{1}` TO `{2}`@`{3}`',
        USER_PRIV               : 'SELECT * FROM `mysql`.`user` WHERE USER = "{0}" AND HOST = "{1}"',
        USER_DATABASE_PRIV      : 'SELECT * FROM `mysql`.`db` WHERE USER = "{0}" AND HOST = "{1}"',
        USER_TABLE_PRIV         : 'SELECT Db, Table_name, Table_priv FROM `mysql`.`tables_priv` WHERE USER = "{0}" AND HOST = "{1}"',
        USER_COLUMN_PRIV        : 'SELECT Db, Table_name, Column_name, Column_priv FROM `mysql`.`columns_priv` WHERE USER = "{0}" AND HOST = "{1}"',
        USER_PROC_PRIV          : 'SELECT Db, Routine_name, Routine_type, Proc_priv FROM `mysql`.`procs_priv` WHERE USER = "{0}" AND HOST = "{1}"',
        SHOW_FULL_FIELDS        : 'SHOW FULL FIELDS FROM `{0}`.`{1}`',
        SHOW_DATABASE_VIEWS     : 'SHOW FULL TABLES FROM `{0}` WHERE TABLE_TYPE LIKE \'VIEW\'',
        SHOW_DATABASE_TABLES    : 'SHOW FULL TABLES FROM `{0}` WHERE table_type = \'BASE TABLE\'',
        SHOW_ADVANCED_PROPERTIES: 'SHOW TABLE STATUS FROM `{0}` LIKE "{1}"',
        SHOW_DATABASE           : 'SHOW DATABASES',
        ADD_INDEX               : 'CREATE {3} INDEX {2} ON `{0}`.`{1}`({4}) {5}',
        SHOW_INDEX              : 'SHOW INDEX FROM `{0}`.`{1}` WHERE key_name="{2}"',
        SHOW_INDEXES            : 'SHOW INDEX FROM `{0}`.`{1}`',
        DROP_INDEX              : 'DROP INDEX {2} ON `{0}`.`{1}`',
        DROP_PROCEDURE          : 'DROP PROCEDURE {2} `{0}`.`{1}`',
        DROP_FUNCTION           : 'DROP FUNCTION {2} `{0}`.`{1}`',
        DROP_TRIGGER            : 'DROP TRIGGER {2} `{0}`.`{1}`',
        DROP_EVENT              : 'DROP EVENT {2} `{0}`.`{1}`',
        DROP_VIEW               : 'DROP VIEW {2} `{0}`.`{1}`',
        SHOW_PROCEDURES         : 'SHOW PROCEDURE STATUS WHERE DB = "{0}"',
        SHOW_FUNCTIONS          : 'SHOW FUNCTION STATUS WHERE DB = "{0}"',
        SHOW_TRIGGERS           : 'SHOW TRIGGERS FROM `{0}`',
        SHOW_EVENTS             : 'SELECT `Event_name`,`Definer`,`Event_type`,`Execute_at`,`Interval_value`,`Interval_field`,`Starts`,`Ends`,`Status` FROM `INFORMATION_SCHEMA`.`EVENTS` WHERE `EVENT_SCHEMA` = "{0}"',
        SHOW_VIEWS              : 'SELECT `TABLE_NAME` AS View_name,`View_definition`,`Check_option`,`Is_updatable`,`Definer`,`Security_type` FROM `INFORMATION_SCHEMA`.`VIEWS` WHERE `TABLE_SCHEMA` = "{0}"',
        SHOW_DATABASE_DDL       : 'SHOW CREATE DATABASE `{0}`',
        SHOW_ALL_TABLE_STATUS   : 'SHOW TABLE STATUS FROM `{0}` WHERE ENGINE IS NOT NULL',
        SHOW_TABLE_STATUS       : 'SHOW TABLE STATUS FROM `{0}` like "{1}"',
        CHANGE_TABLE_TYPE       : 'ALTER TABLE `{0}`.`{1}` ENGINE = {2}',
        INSERT_TABLE            : 'INSERT INTO `{0}`.`{1}` ({2}) VALUES({3});',
        INSERT_TABLE_BULK       : 'INSERT INTO `{0}`.`{1}` ({2}) VALUES {3};',
        INSERT_ON_DUPLICATE     : 'INSERT INTO `{0}`.`{1}` ({2}) VALUES({3}) ON DUPLICATE KEY UPDATE {4}',
        UPDATE_TABLE            : 'UPDATE `{0}`.`{1}` SET {2} WHERE {3};',
        DELETE_TABLE            : 'DELETE FROM `{0}`.`{1}` WHERE {2};',
        SELECT_TABLE            : 'SELECT {2} FROM `{0}`.`{1}` {3};',
        TRUNCATE_TABLE          : 'TRUNCATE TABLE `{0}`.`{1}`',
        RENAME_TABLE            : 'RENAME TABLE `{0}`.`{1}` TO `{2}`.`{3}`',
        DROP_TABLE              : 'DROP TABLE {2} `{0}`.`{1}`',
        TABLE_CREATE_INFO       : 'SHOW CREATE TABLE `{0}`.`{1}`',
        TABLE_KEYS_INFO         : 'SHOW KEYS FROM `{0}`.`{1}`',
        INDEX_KEYS_INFO         : 'SHOW KEYS FROM `{0}`.`{1}` WHERE key_name="{2}"',
        CREATE_PROCEDURE        : 'DELIMITER $$ \nCREATE \n/*[DEFINER = { user | CURRENT_USER }]*/ \nPROCEDURE `{0}`.`{1}`() \n\n/* LANGUAGE SQL */\n/* [NOT] DETERMINISTIC  { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA } */\n/* SQL SECURITY { DEFINER | INVOKER } */\n/* COMMENT \'string\'*/ \nBEGIN \n\n\t/* SQL Statements */ \n\nEND$$ \nDELIMITER ;',
        CREATE_FUNCTION         : 'DELIMITER $$ \nCREATE \n/*[DEFINER = { user | CURRENT_USER }]*/ \nFUNCTION `{0}`.`{1}`() \nRETURNS INT /*{STRING|INTEGER|REAL|DECIMAL}*/ /*LANGUAGE SQL | [NOT] DETERMINISTIC | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA } | SQL SECURITY { DEFINER | INVOKER } | COMMENT \'string\'*/ \nBEGIN \n\n\t/* SQL Statements */ \n\nEND$$ \nDELIMITER ;',
        CREATE_TRIGGER          : 'DELIMITER $$ \nCREATE \n/*[DEFINER = { user | CURRENT_USER }]*/ \nTRIGGER `{0}`.`{1}` \nBEFORE \n-- AFTER \nINSERT \n-- UPDATE \n-- DELETE \nON `{0}`.`<Table Name>` FOR EACH ROW \nBEGIN  \n\n\t/* SQL Statements */ \n\nEND$$ \nDELIMITER ;',
        CREATE_EVENT            : 'DELIMITER $$ \n-- SET GLOBAL event_scheduler = ON$$ \n-- required for event to execute but not create \nCREATE \n/*[DEFINER = { user | CURRENT_USER }]*/ \nEVENT `{0}`.`{1}` \nON SCHEDULE EVERY 1 HOUR /* uncomment the example below you want to use */ \n-- scheduleexample 1: run once \n-- AT \'YYYY-MM-DD HH:MM.SS\'/CURRENT_TIMESTAMP { + INTERVAL 1 [HOUR|MONTH|WEEK|DAY|MINUTE|...] } \n-- scheduleexample 2: run at intervals forever after creation \n-- scheduleexample 3: specified start time, end time and interval for execution \n/* \n\tEVERY 1  [HOUR|MONTH|WEEK|DAY|MINUTE|...] \n\tSTARTS CURRENT_TIMESTAMP/\'YYYY-MM-DD HH:MM.SS\' { + INTERVAL 1[HOUR|MONTH|WEEK|DAY|MINUTE|...] } \n\tENDS CURRENT_TIMESTAMP/\'YYYY-MM-DD HH:MM.SS\' { + INTERVAL 1 [HOUR|MONTH|WEEK|DAY|MINUTE|...] } \n*/ \n/*[ON COMPLETION [NOT] PRESERVE] [ENABLE | DISABLE] */ \n/* COMMENT \'comment\' */ \nDO BEGIN \n\n\t/* SQL Statements */ \n\nEND$$ \nDELIMITER ;',
        CREATE_VIEW             : 'CREATE \n/* [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}] */ \n/* DEFINER = user | CURRENT_USER */  \n/* SQL SECURITY { DEFINER | INVOKER }] */  \nVIEW `{0}`.`{1}` AS  \n/* SQL SELECT Statement */',
        SHOW_CREATE_PROCEDURE   : 'SHOW CREATE PROCEDURE `{0}`.`{1}`',
        SHOW_CREATE_TABLE       : 'SHOW CREATE TABLE `{0}`.`{1}`',
        SHOW_CREATE_VIEW        : 'SHOW CREATE TABLE `{0}`.`{1}`',
        SHOW_CREATE_FUNCTION    : 'SHOW CREATE FUNCTION `{0}`.`{1}`',
        SHOW_CREATE_TRIGGER     : 'SHOW CREATE TRIGGER `{0}`.`{1}`',
        SHOW_CREATE_EVENT       : 'SHOW CREATE EVENT `{0}`.`{1}`',
        CREATE_TABLE            : 'CREATE TABLE `{0}`.`{1}` {2}',
        ALTER_TABLE             : 'ALTER TABLE `{0}`.`{1}` {2}',
        ALTER_VIEW              : 'DELIMITER $$ \nUSE `{0}`$$ \nDROP VIEW IF EXISTS `{1}`$$ \n{2}$$ \nDELIMITER;',
        ALTER_PROCEDURE         : 'DELIMITER $$ \nUSE `{0}`$$ \nDROP PROCEDURE IF EXISTS `{1}`$$ \n{2}$$ \nDELIMITER;',
        ALTER_FUNCTION          : 'DELIMITER $$ \nUSE `{0}`$$ \nDROP FUNCTION IF EXISTS `{1}`$$ \n{2}$$ \nDELIMITER;',
        ALTER_TRIGGER           : 'DELIMITER $$ \nUSE `{0}`$$ \nDROP TRIGGER IF EXISTS `{1}`$$ \n{2}$$ \nDELIMITER;',
        ALTER_EVENT             : 'DELIMITER $$ \nUSE `{0}`$$ \nDROP EVENT IF EXISTS `{1}`$$ \n{2}$$ \nDELIMITER;',
        SHOW_PROCESS_LIST       : 'SHOW FULL PROCESSLIST',
        SHOW_VARIABLES          : 'SHOW VARIABLES',
        SHOW_STATUS             : 'SHOW STATUS',
        SHOW_GLOBAL_STATUS      : 'SHOW GLOBAL STATUS',
        SHOW_SESSION_STATUS     : 'SHOW SESSION STATUS',
        CREATE_DATABASE         : 'CREATE DATABASE `{0}` CHARACTER SET {1} COLLATE {2}',
        ALTER_DATABASE          : 'ALTER DATABASE `{0}` CHARACTER SET {1} COLLATE {2}',
        DROP_DATABASE           : 'DROP DATABASE `{0}`',
        SHOW_CHARSET            : 'SHOW CHARSET',
        SHOW_COLLATION          : 'SHOW COLLATION',
        SHOW_COLUMNS            : 'SHOW FULL COLUMNS FROM `{0}`.`{1}`',
        CHARSET_DATABASE        : 'SHOW VARIABLES LIKE \'character_set_database\'',
        COLLATION_DATABASE      : 'SHOW VARIABLES LIKE \'collation_database\'',
        KILL_QUERY              : 'KILL {0}',
        SHOW_DATABASES          : 'SHOW DATABASES',
        COPY_TABLE_STRUCTURE    : 'CREATE TABLE `{2}`.`{3}` LIKE `{0}`.`{1}`',
        COPY_TABLE_DATA         : 'INSERT `{2}`.`{3}` SELECT * FROM `{0}`.`{1}`'

    };

    var joins = [
        'NATURAL JOIN', 'INNER JOIN', 'LFET INNER JOIN', 'RIGHT INNER JOIN', 'LEFT OUTER JOIN',
        'LEFT JOIN', 'RIGHT OUTER JOIN', 'RIGHT JOIN', 'CROSS JOIN', 'JOIN', 'FROM'
    ];

    var etc = [
        'ON DUPLICATE KEY UPDATE'
    ];

    var functions = [
        'ABS', 'ACOS', 'ADDDATE', 'ADDTIME', 'AES_DECRYPT',
        'AES_ENCRYPT', 'AREA', 'ASBINARY', 'ASWKB', 'ASCII',
        'ASIN', 'ASTEXT', 'ASWKT', 'ATAN2', 'ATAN',
        'ATAN', 'AVG', 'BDMPOLYFROMTEXT', 'BDMPOLYFROMWKB', 'BDPOLYFROMTEXT',
        'BDPOLYFROMWKB', 'BENCHMARK', 'BIN', 'BINARY', 'BIT_AND',
        'BIT_COUNT', 'BIT_LENGTH', 'BIT_OR', 'BIT_XOR', 'BOUNDARY',
        'BUFFER', 'CAST', 'CEIL', 'CEILING', 'CHAR_LENGTH',
        'CHAR', 'CHARACTER_LENGTH', 'CHARSET', 'COALESCE', 'COERCIBILITY',
        'COLLATION', 'COMPRESS', 'CONCAT_WS', 'CONCAT', 'CONNECTION_ID',
        'CONTAINS', 'CONV', 'CONVERT_TZ', 'CONVERT', 'COS',
        'COT', 'COUNT', 'CRC32', 'CROSSES', 'CURDATE',
        'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER',
        'CURTIME', 'DATABASE', 'DATE_ADD', 'DATE_FORMAT', 'DATE_SUB',
        'DATE', 'DATEDIFF', 'DAY', 'DAYNAME', 'DAYOFMONTH',
        'DAYOFWEEK', 'DAYOFYEAR', 'DECODE', 'DEFAULT', 'DEGREES',
        'DES_DECRYPT', 'DES_ENCRYPT', 'DIMENSION', 'DISJOINT', 'DIV',
        'ELT', 'ENCODE', 'ENCRYPT', 'ENDPOINT', 'ENVELOPE',
        'EQUALS', 'EXP', 'EXPORT_SET', 'EXTERIORRING', 'EXTRACT',
        'EXTRACTVALUE', 'FIELD', 'FIND_IN_SET', 'FLOOR', 'FORMAT',
        'FOUND_ROWS', 'FROM_BASE64', 'FROM_DAYS', 'FROM_UNIXTIME', 'GEOMCOLLFROMTEXT',
        'GEOMETRYCOLLECTIONFROMTEXT', 'GEOMCOLLFROMWKB', 'GEOMETRYCOLLECTIONFROMWKB', 'GEOMETRYCOLLECTION', 'GEOMETRYN',
        'GEOMETRYTYPE', 'GEOMFROMTEXT', 'GEOMETRYFROMTEXT', 'GEOMFROMWKB', 'GET_FORMAT',
        'GET_LOCK', 'GLENGTH', 'GREATEST', 'GROUP_CONCAT', 'GTID_SUBSET',
        'GTID_SUBTRACT', 'HEX', 'HOUR', 'IF', 'IFNULL',
        'IN', 'INET_ATON', 'INET_NTOA', 'INET6_ATON', 'INET6_NTOA',
        'INSERT', 'INSTR', 'INTERIORRINGN', 'INTERSECTS', 'INTERVAL',
        'IS_FREE_LOCK', 'IS_IPV4_COMPAT', 'IS_IPV4_MAPPED', 'IS_IPV4', 'IS_IPV6',
        'IS_USED_LOCK', 'ISCLOSED', 'ISEMPTY', 'ISNULL', 'ISSIMPLE',
        'LAST_DAY', 'LAST_INSERT_ID', 'LCASE', 'LEAST', 'LEFT',
        'LENGTH', 'LINEFROMTEXT', 'LINEFROMWKB', 'LINESTRINGFROMWKB', 'LINESTRING',
        'LN', 'LOAD_FILE', 'LOCALTIME', 'LOCALTIME', 'LOCALTIMESTAMP',
        'LOCALTIMESTAMP', 'LOCATE', 'LOG10', 'LOG2', 'LOG',
        'LOWER', 'LPAD', 'LTRIM', 'MAKE_SET', 'MAKEDATE',
        'MAKETIME', 'MASTER_POS_WAIT', 'MAX', 'MBRCONTAINS', 'MBRDISJOINT',
        'MBREQUAL', 'MBRINTERSECTS', 'MBROVERLAPS', 'MBRTOUCHES', 'MBRWITHIN',
        'MD5', 'MICROSECOND', 'MID', 'MIN', 'MINUTE',
        'MLINEFROMTEXT', 'MULTILINESTRINGFROMTEXT', 'MLINEFROMWKB', 'MULTILINESTRINGFROMWKB', 'MOD',
        'MONTH', 'MONTHNAME', 'MPOINTFROMTEXT', 'MULTIPOINTFROMTEXT', 'MPOINTFROMWKB',
        'MULTIPOINTFROMWKB', 'MPOLYFROMTEXT', 'MULTIPOLYGONFROMTEXT', 'MPOLYFROMWKB', 'MULTIPOLYGONFROMWKB',
        'MULTILINESTRING', 'MULTIPOINT', 'MULTIPOLYGON', 'NAME_CONST', 'NOT',
        'IN', 'NOW', 'NULLIF', 'NUMGEOMETRIES', 'NUMINTERIORRINGS',
        'NUMPOINTS', 'OCT', 'OCTET_LENGTH', 'OLD_PASSWORD', 'ORD',
        'OVERLAPS', 'PASSWORD', 'PERIOD_ADD', 'PERIOD_DIFF', 'PI',
        'POINT', 'POINTFROMTEXT', 'POINTFROMWKB', 'POINTN', 'POLYFROMTEXT',
        'POLYGONFROMTEXT', 'POLYFROMWKB', 'POLYGONFROMWKB', 'POLYGON', 'POSITION',
        'POW', 'POWER', 'PROCEDURE', 'ANALYSE', 'QUARTER',
        'QUOTE', 'RADIANS', 'RAND', 'RANDOM_BYTES', 'REGEXP',
        'RELEASE_LOCK', 'REPEAT', 'REPLACE', 'REVERSE', 'RIGHT',
        'RLIKE', 'ROUND', 'ROW_COUNT', 'RPAD', 'RTRIM',
        'SCHEMA', 'SEC_TO_TIME', 'SECOND', 'SESSION_USER', 'SHA1',
        'SHA', 'SHA2', 'SIGN', 'SIN', 'SLEEP',
        'SOUNDEX', 'SPACE', 'SQRT', 'SRID', 'ST_CONTAINS',
        'ST_CROSSES', 'ST_DISJOINT', 'ST_EQUALS', 'ST_INTERSECTS', 'ST_OVERLAPS',
        'ST_TOUCHES', 'ST_WITHIN', 'STARTPOINT', 'STD', 'STDDEV_POP',
        'STDDEV_SAMP', 'STDDEV', 'STR_TO_DATE', 'STRCMP', 'SUBDATE',
        'SUBSTR', 'SUBSTRING_INDEX', 'SUBSTRING', 'SUBTIME', 'SUM',
        'SYSDATE', 'SYSTEM_USER', 'TAN', 'TIME_FORMAT', 'TIME_TO_SEC',
        'TIME', 'TIMEDIFF', 'TIMESTAMP', 'TIMESTAMPADD', 'TIMESTAMPDIFF',
        'TO_BASE64', 'TO_DAYS', 'TO_SECONDS', 'TOUCHES', 'TRIM',
        'TRUNCATE', 'UCASE', 'UNCOMPRESS', 'UNCOMPRESSED_LENGTH', 'UNHEX',
        'UNIX_TIMESTAMP', 'UPDATEXML', 'UPPER', 'USER', 'UTC_DATE',
        'UTC_TIME', 'UTC_TIMESTAMP', 'UUID_SHORT', 'UUID', 'VALIDATE_PASSWORD_STRENGTH',
        'VAR_POP', 'VAR_SAMP', 'VARIANCE', 'VERSION', 'WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS',
        'WEEK', 'WEEKDAY', 'WEEKOFYEAR', 'WEIGHT_STRING', 'WITHIN',
        'X', 'Y', 'YEAR', 'YEARWEEK'
    ];

    var reserved_words = [
        'ACCESSIBLE', 'ADD', 'ALL', 'ALTER', 'ANALYZE',
        'AND', 'AS', 'ASC', 'ASENSITIVE', 'BEFORE',
        'BETWEEN', 'BIGINT', 'BINARY', 'BLOB', 'BOTH',
        'BY', 'CALL', 'CASCADE', 'CASE', 'CHANGE',
        'CHAR', 'CHARACTER', 'CHECK', 'COLLATE', 'COLUMN',
        'CONDITION', 'CONSTRAINT', 'CONTINUE', 'CONVERT', 'CREATE',
        'CROSS', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'CURRENT_USER',
        'CURSOR', 'DATABASE', 'DATABASES', 'DAY_HOUR', 'DAY_MICROSECOND',
        'DAY_MINUTE', 'DAY_SECOND', 'DEC', 'DECIMAL', 'DECLARE',
        'DEFAULT', 'DELAYED', 'DELETE', 'DESC', 'DESCRIBE',
        'DETERMINISTIC', 'DISTINCT', 'DISTINCTROW', 'DIV', 'DOUBLE',
        'DROP', 'DUAL', 'DUPLICATE', 'EACH', 'ELSE',
        'ELSEIF', 'ENCLOSED', 'ESCAPED', 'EXISTS', 'EXIT',
        'EXPLAIN', 'FALSE', 'FETCH', 'FLOAT', 'FLOAT4',
        'FLOAT8', 'FOR', 'FORCE', 'FOREIGN',
        'FULLTEXT', 'GET', 'GRANT', 'GROUP BY', 'GROUP', 'HAVING',
        'HIGH_PRIORITY', 'HOUR_MICROSECOND', 'HOUR_MINUTE', 'HOUR_SECOND', 'IF',
        'IGNORE', 'IN', 'INDEX', 'INFILE', 'INNER',
        'INOUT', 'INSENSITIVE', 'INSERT INTO', 'INSERT', 'INT', 'INT1',
        'INT2', 'INT3', 'INT4', 'INT8', 'INTEGER',
        'INTERVAL', 'INTO', 'IO_AFTER_GTIDS', 'IO_BEFORE_GTIDS', 'IS',
        'ITERATE', 'JOIN', 'KEY UPDATE', 'KEY', 'KEYS', 'KILL',
        'LEADING', 'LEAVE', 'LEFT', 'LIKE', 'LIMIT',
        'LINEAR', 'LINES', 'LOAD', 'LOCALTIME', 'LOCALTIMESTAMP',
        'LOCK', 'LONG', 'LONGBLOB', 'LONGTEXT', 'LOOP',
        'LOW_PRIORITY', 'MASTER_BIND', 'MASTER_SSL_VERIFY_SERVER_CERT', 'MATCH', 'MAXVALUE',
        'MEDIUMBLOB', 'MEDIUMINT', 'MEDIUMTEXT', 'MIDDLEINT', 'MINUTE_MICROSECOND',
        'MINUTE_SECOND', 'MOD', 'MODIFIES', 'NATURAL', 'NOT',
        'NO_WRITE_TO_BINLOG', 'NULL', 'NUMERIC', 'ON DUPLICATE KEY UPDATE', 'ON', 'OPTIMIZE',
        'OPTION', 'OPTIONALLY', 'OR', 'ORDER BY', 'ORDER', 'OUT',
        'OUTER', 'OUTFILE', 'PARTITION', 'PRECISION', 'PRIMARY',
        'PROCEDURE', 'PURGE', 'RANGE', 'READ', 'READS',
        'READ_WRITE', 'REAL', 'REFERENCES', 'REGEXP', 'RELEASE',
        'RENAME', 'REPEAT', 'REPLACE', 'REQUIRE', 'RESIGNAL',
        'RESTRICT', 'RETURN', 'REVOKE', 'RIGHT', 'RLIKE',
        'SCHEMA', 'SCHEMAS', 'SECOND_MICROSECOND', 'SELECT', 'SENSITIVE',
        'SEPARATOR', 'SET', 'SHOW', 'SIGNAL', 'SMALLINT',
        'SPATIAL', 'SPECIFIC', 'SQL', 'SQLEXCEPTION', 'SQLSTATE',
        'SQLWARNING', 'SQL_BIG_RESULT', 'SQL_CALC_FOUND_ROWS', 'SQL_SMALL_RESULT', 'SSL',
        'STARTING', 'STRAIGHT_JOIN', 'TABLE', 'TERMINATED', 'THEN',
        'TINYBLOB', 'TINYINT', 'TINYTEXT', 'TO', 'TRAILING',
        'TRIGGER', 'TRUE', 'UNDO', 'UNION', 'UNIQUE',
        'UNLOCK', 'UNSIGNED', 'UPDATE', 'USAGE', 'USE',
        'USING', 'UTC_DATE', 'UTC_TIME', 'UTC_TIMESTAMP', 'VALUES',
        'VARBINARY', 'VARCHAR', 'VARCHARACTER', 'VARYING', 'WHEN',
        'WHERE', 'WHILE', 'WITH', 'WRITE', 'XOR',
        'YEAR_MONTH', 'ZEROFILL', 'BEGIN', 'END'
    ];

    var detect_keyword = [
        'INSERT', 'INTO', 'UPDATE', 'FROM', 'JOIN',
        'TABLE', 'PROCEDURE', 'FUNCTION', 'VIEW', 'TRIGGER',
        'EVENT'
    ];

    var not_select_queries = [
        "UPDATE", "CREATE", "DELETE", "INSERT", "ALTER", "DROP"
    ];

    var data_types = [
        'tinyint', 'int', 'varchar', 'float', 'double',
        'timestamp', 'bit', 'bigint', 'mediumint', 'date',
        'time', 'datetime', 'year', 'date', 'enum',
        'set', 'tinyblob', 'mediumblob', 'longblob', 'blob',
        'varchar', 'char', 'geometr'
    ];

    //var strs = "";
    //Ext.Array.each(data_types, function(name, idx) {
    //
    //    strs += "'" + name + "', ";
    //
    //    if ((idx + 1) % 5 === 0 && idx > 0) {
    //
    //        strs += "\n";
    //    }
    //});
    //
    //console.log(strs);

    var regexpLimit = "LIMIT\\s*[0-9]+(\\s*,\\s*[0-9]+)?";

    return {
        singleton         : true,
        constructor       : function(config) {


            this.callParent(arguments);
        },
        getQuery          : function(query) {

            var args = Ext.Array.slice(arguments, 1);
            args.unshift(queries[query]);

            return Ext.String.format.apply(this, args);
        },
        getDataTypes      : function() {

            return data_types;
        },
        getDataTypesToJSON: function() {

            var json = [];

            Ext.Array.each(data_types, function(type, idx) {

                json.push([type, type]);
            });

            return json;
        },

        getDetectKeywords: function() {

            return detect_keyword;
        },

        getNotSelectQueries: function() {

            return not_select_queries;
        },

        getFunctions: function() {

            return functions;
        },

        getReservedWords: function() {

            return reserved_words;
        },

        getJoins: function() {

            return joins;
        },

        getRegexpLimit: function() {

            return regexpLimit;
        }
    }
})
;