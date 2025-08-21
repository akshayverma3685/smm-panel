export function paginate(q: any){
  const page = Math.max(1, Number(q.page||1));
  const pageSize = Math.min(100, Math.max(1, Number(q.pageSize||20)));
  return { skip: (page-1)*pageSize, take: pageSize, page, pageSize };
}
