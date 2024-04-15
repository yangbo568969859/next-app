interface Params {
  params: {
    param: string;
    path: Array<string>;
    locale: string;
  };
}

export default function PageParam({ params }: Params) {
  const { path = [], locale = 'en' } = params;
  return (
    <div>
      <div>[...params] 参数 {JSON.stringify(params)}</div>
      <div>{path}</div>
    </div>
  );
}
