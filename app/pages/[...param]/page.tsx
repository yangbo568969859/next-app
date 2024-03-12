interface Params {
    params: {
        param: string;
    }
}

export default function PageParam (
    { params } : Params
) {
    return (
        <div>
            [...params] 参数 {JSON.stringify(params)}
        </div>
    )
}