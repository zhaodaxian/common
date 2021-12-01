import axios from "axios";

// 取消重复请求
export class CancelManyRequest {
    static PENDINGMAP: Map<string, any> = new Map()
    static getPendingKey (config) :string {
        let { method, params, url, data } = config;
        if (typeof data === 'string') data = JSON.parse(data)
        return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&');
    }
    static addPending (config) {
        const pendingKey = this.getPendingKey(config)
        config.cancelToken = new axios.CancelToken((cancel) => {
            if(!this.PENDINGMAP.has(pendingKey)) {
                this.PENDINGMAP.set(pendingKey, cancel)
            }
        })
    }
    static removePending (config) {
        const pendingKey = this.getPendingKey(config)
        if (this.PENDINGMAP.has(pendingKey)) {
            const cancelToken = this.PENDINGMAP.get(pendingKey);
            cancelToken(pendingKey);
            this.PENDINGMAP.delete(pendingKey);
        }
    }
}
// 默认自定义配置
export const common_options = {
    repeat_request_cancel: false
}
