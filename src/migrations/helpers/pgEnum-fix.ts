// eslint-disable-next-line @typescript-eslint/no-var-requires
const PostgresQueryGenerator = require('sequelize/lib/dialects/postgres/query-generator');

// eslint-disable-next-line func-names, @typescript-eslint/no-explicit-any
PostgresQueryGenerator.prototype.pgEnum = function (tableName: any, attr: any, dataType: any, options: any) {
  const enumName = this.pgEnumName(tableName, attr, options);
  const values = dataType.values
    ? `ENUM(${dataType.values.map((value: string) => this.escape(value)).join(', ')})`
    : dataType.toString().match(/^ENUM\(.+\)/)[0];

  let sql =
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_${tableName}_${attr}')` +
    ` THEN CREATE TYPE ${enumName} AS ${values}; END IF; END$$;`;
  if (!!options && options.force === true) {
    sql = this.pgEnumDrop(tableName, attr) + sql;
  }
  return sql;
};
