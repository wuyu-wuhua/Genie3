# SQL 修复说明

## 问题描述

在创建 `get_popular_options()` 函数时出现了语法错误：
```
ERROR: 42601: syntax error at or near "UNION"
LINE 103: UNION ALL
```

## 问题原因

在 PostgreSQL 的 PL/pgSQL 函数中，`RETURN QUERY` 语句不能直接使用 `UNION ALL` 来连接多个查询。每个 `RETURN QUERY` 必须是独立的语句。

## 修复方案

将原来的单个 `RETURN QUERY` 语句拆分为多个独立的 `RETURN QUERY` 语句：

### 修复前（错误语法）：
```sql
RETURN QUERY
SELECT 'usecases'::TEXT, unnest(usecases) as option_value, COUNT(*) as count
FROM surveys
GROUP BY unnest(usecases)
ORDER BY count DESC
LIMIT 10

UNION ALL

SELECT 'selling'::TEXT, unnest(selling) as option_value, COUNT(*) as count
FROM surveys
GROUP BY unnest(selling)
ORDER BY count DESC
LIMIT 10

UNION ALL

SELECT 'concerns'::TEXT, unnest(concerns) as option_value, COUNT(*) as count
FROM surveys
GROUP BY unnest(concerns)
ORDER BY count DESC
LIMIT 10;
```

### 修复后（正确语法）：
```sql
RETURN QUERY
SELECT 'usecases'::TEXT, unnest(usecases) as option_value, COUNT(*) as count
FROM surveys
GROUP BY unnest(usecases)
ORDER BY count DESC
LIMIT 10;

RETURN QUERY
SELECT 'selling'::TEXT, unnest(selling) as option_value, COUNT(*) as count
FROM surveys
GROUP BY unnest(selling)
ORDER BY count DESC
LIMIT 10;

RETURN QUERY
SELECT 'concerns'::TEXT, unnest(concerns) as option_value, COUNT(*) as count
FROM surveys
GROUP BY unnest(concerns)
ORDER BY count DESC
LIMIT 10;
```

## 技术说明

### 为什么不能使用 UNION ALL？

1. **PL/pgSQL 语法限制**：在 PL/pgSQL 函数中，`RETURN QUERY` 期望一个完整的 SQL 查询语句
2. **复合查询处理**：`UNION ALL` 创建的是复合查询，不能直接作为 `RETURN QUERY` 的参数
3. **函数执行流程**：每个 `RETURN QUERY` 会向结果集添加行，多个 `RETURN QUERY` 会依次执行并累积结果

### 修复后的执行流程

1. 第一个 `RETURN QUERY` 执行，获取热门应用场景
2. 第二个 `RETURN QUERY` 执行，获取热门卖点
3. 第三个 `RETURN QUERY` 执行，获取热门顾虑
4. 所有结果自动合并到函数的返回表中

## 测试建议

修复后，可以通过以下方式测试函数：

```sql
-- 测试函数是否正常创建
SELECT get_popular_options();

-- 或者查看函数定义
\df+ get_popular_options
```

## 其他注意事项

1. **性能考虑**：每个 `RETURN QUERY` 都会执行一次数据库查询，如果数据量大，可能需要优化
2. **结果顺序**：结果的顺序将按照 `RETURN QUERY` 的执行顺序排列
3. **错误处理**：如果某个查询失败，整个函数会失败，建议添加适当的错误处理

## 总结

通过将单个 `RETURN QUERY` 语句拆分为多个独立的 `RETURN QUERY` 语句，成功解决了 SQL 语法错误。修复后的函数能够正常执行，并返回预期的结果。
