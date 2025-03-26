import { YaoQueryParam } from '@yaoapps/types';
import { PaginateDataArray } from './lib';

// 测试数据集
const testData = [
  { id: 1, name: 'Alice', age: 25, active: true, score: 85 },
  { id: 2, name: 'Bob', age: 30, active: false, score: 92 },
  { id: 3, name: 'Charlie', age: 22, active: true, score: 78 },
  { id: 4, name: 'David', age: 35, active: true, score: 95 },
  { id: 5, name: 'Eve', age: 28, active: false, score: 88 },
  { id: 6, name: 'Frank', age: 32, active: true, score: 91 },
  { id: 7, name: 'Grace', age: 27, active: true, score: 83 },
  { id: 8, name: 'Henry', age: 31, active: false, score: 87 },
  { id: 9, name: 'Ivy', age: 24, active: true, score: 89 },
  { id: 10, name: 'Jack', age: 29, active: true, score: 94 }
];

/**
 * 测试PaginateDataArray函数的各种功能场景
 */
/**
 * 测试基本分页功能
 */
function testBasicPagination() {
  console.log('\n1. 测试基本分页功能：');
  const basicResult = PaginateDataArray(testData, {}, 1, 3);
  console.log('每页3条记录的第1页：', basicResult);

  const expectedBasicResult = {
    data: testData.slice(0, 3),
    next: 2,
    prev: -1,
    page: 1,
    pagesize: 3,
    pagecnt: 4,
    total: 10
  };
  console.assert(
    JSON.stringify(basicResult) === JSON.stringify(expectedBasicResult),
    '基本分页功能测试失败：\n预期结果：',
    expectedBasicResult,
    '\n实际结果：',
    basicResult
  );
}

/**
 * 测试简单where条件查询
 */
function testSimpleWhereCondition() {
  console.log('\n2. 测试简单where条件：');
  const simpleWhereResult = PaginateDataArray(
    testData,
    {
      wheres: [{ column: 'age', op: 'gt', value: 30 }]
    },
    1,
    10
  );
  console.log('年龄大于30的记录：', simpleWhereResult);

  const expectedSimpleWhereResult = {
    data: testData.filter((item) => item.age > 30),
    next: -1,
    prev: -1,
    page: 1,
    pagesize: 10,
    pagecnt: 1,
    total: 3
  };
  console.assert(
    JSON.stringify(simpleWhereResult) ===
      JSON.stringify(expectedSimpleWhereResult),
    '简单where条件测试失败：\n预期结果：',
    expectedSimpleWhereResult,
    '\n实际结果：',
    simpleWhereResult
  );
}

/**
 * 测试复杂where条件组合查询
 */
function testComplexWhereCondition() {
  console.log('\n3. 测试复杂where条件组合：');
  const complexWhereResult = PaginateDataArray(
    testData,
    {
      wheres: [
        { column: 'active', value: true },
        { column: 'score', op: 'gt', value: 85, method: 'andwhere' },
        { column: 'age', op: 'lt', value: 30, method: 'orwhere' }
      ]
    },
    1,
    10
  );
  console.log('活跃用户且分数>85，或年龄<30的记录：', complexWhereResult);

  const expectedComplexWhereResult = {
    data: testData.filter(
      (item) => (item.active === true && item.score > 85) || item.age < 30
    ),
    next: -1,
    prev: -1,
    page: 1,
    pagesize: 10,
    pagecnt: 1,
    total: 8
  };
  console.assert(
    JSON.stringify(complexWhereResult) ===
      JSON.stringify(expectedComplexWhereResult),
    '复杂where条件组合测试失败：\n预期结果：',
    expectedComplexWhereResult,
    '\n实际结果：',
    complexWhereResult
  );
}

/**
 * 测试排序功能
 */
function testOrderBy() {
  console.log('\n4. 测试排序功能：');
  const orderResult = PaginateDataArray(
    testData,
    {
      orders: [
        { column: 'score', option: 'desc' },
        { column: 'age', option: 'asc' }
      ]
    },
    1,
    5
  );
  console.log('按分数降序、年龄升序排列：', orderResult);

  const expectedOrderResult = {
    data: [...testData]
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return a.age - b.age;
      })
      .slice(0, 5),
    next: 2,
    prev: -1,
    page: 1,
    pagesize: 5,
    pagecnt: 2,
    total: 10
  };
  console.assert(
    JSON.stringify(orderResult) === JSON.stringify(expectedOrderResult),
    '排序功能测试失败：\n预期结果：',
    expectedOrderResult,
    '\n实际结果：',
    orderResult
  );
}

/**
 * 测试limit和offset功能
 */
function testLimitOffset() {
  console.log('\n5. 测试limit和offset：');
  const limitOffsetResult = PaginateDataArray(
    testData,
    {
      offset: 3,
      limit: 4
    },
    1,
    10
  );
  console.log('跳过前3条记录，获取4条记录：', limitOffsetResult);

  const expectedLimitOffsetResult = {
    data: testData.slice(3, 7),
    next: -1,
    prev: -1,
    page: 1,
    pagesize: 10,
    pagecnt: 1,
    total: 10
  };
  console.assert(
    JSON.stringify(limitOffsetResult) ===
      JSON.stringify(expectedLimitOffsetResult),
    'limit和offset功能测试失败：\n预期结果：',
    expectedLimitOffsetResult,
    '\n实际结果：',
    limitOffsetResult
  );
}

/**
 * 测试组合查询功能
 */
function testCombinedQuery() {
  console.log('\n6. 测试组合查询：');
  const combinedResult = PaginateDataArray(
    testData,
    {
      wheres: [
        { column: 'active', value: true },
        { column: 'age', op: 'ge', value: 25, method: 'andwhere' }
      ],
      orders: [{ column: 'score', option: 'desc' }],
      offset: 1,
      limit: 3
    },
    1,
    10
  );
  console.log('活跃用户且年龄>=25，按分数降序，跳过1条取3条：', combinedResult);

  const filteredData = testData
    .filter((item) => item.active === true && item.age >= 25)
    .sort((a, b) => b.score - a.score)
    .slice(1, 4);

  const expectedCombinedResult = {
    data: filteredData,
    next: -1,
    prev: -1,
    page: 1,
    pagesize: 10,
    pagecnt: 1,
    total: 5
  };
  console.assert(
    JSON.stringify(combinedResult) === JSON.stringify(expectedCombinedResult),
    '组合查询功能测试失败：\n预期结果：',
    expectedCombinedResult,
    '\n实际结果：',
    combinedResult
  );
}

/**
 * 执行所有测试用例
 */
export function testPaginateDataArray() {
  testBasicPagination();
  testSimpleWhereCondition();
  testComplexWhereCondition();
  testOrderBy();
  testLimitOffset();
  testCombinedQuery();
}

// testPaginateDataArray();
