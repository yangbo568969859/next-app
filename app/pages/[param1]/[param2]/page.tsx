interface Params {
    params: {
        param1: string;
        param2: string;
    }
}

export default function PageParam (
    { params } : Params
) {
    return (
        <div>
            PageContent 参数 {JSON.stringify(params)}
        </div>
    )
}