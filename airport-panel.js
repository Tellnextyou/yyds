const SUBS = [
    {
        name: "ofoNet",
        url: "https://e4m8qx.ofody.vip/cmcc/nnm/tb/qq/wx/10086/kygmwlmlmnsv/ofoNET86?token=44d056a8f1b2aec822dabed7b5f652d5"
    },
    {
        name: "Echo",
        url: "https://dy.ehho.cc/api/v1/client/subscribe?token=e992705d9db9135858646e2e53d70a1a"
    }
];

function format(bytes) {
    return (bytes / 1024 / 1024 / 1024).toFixed(1) + "G";
}

function getInfo(sub, callback) {
    $httpClient.get(sub.url, function(error, response) {
        if (error) {
            return callback(`❌ ${sub.name}`);
        }

        let info = response.headers["subscription-userinfo"];
        if (!info) {
            return callback(`⚠️ ${sub.name} 不支持`);
        }

        let u = parseInt(info.match(/upload=(\d+)/)[1]);
        let d = parseInt(info.match(/download=(\d+)/)[1]);
        let t = parseInt(info.match(/total=(\d+)/)[1]);
        let e = info.match(/expire=(\d+)/);

        let used = u + d;
        let remain = t - used;
        let percent = ((used / t) * 100).toFixed(0);

        let expire = e
            ? new Date(e[1] * 1000).toLocaleDateString()
            : "未知";

        callback(
            `✈️ ${sub.name}\n` +
            `剩余: ${format(remain)} | 使用: ${percent}%\n` +
            `到期: ${expire}`
        );
    });
}

let results = [];
let count = 0;

SUBS.forEach(sub => {
    getInfo(sub, res => {
        results.push(res);
        count++;

        if (count === SUBS.length) {
            $done({
                title: "🌐 机场流量面板",
                content: results.join("\n\n"),
                icon: "airplane"
            });
        }
    });
});