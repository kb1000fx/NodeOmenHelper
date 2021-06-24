# Node Omen Helper
## 简介
使用Node JS自动完成HP OMEN任务

原帖发在其乐论坛 [Node版秒速完成OMEN](https://keylol.com/t718593-1-1)，现在论坛号被封了帖子也被屏蔽了，以后更新说明只能放在这里了

## 使用说明
### 安装依赖
```
npm install
```
### 运行
```
npm start <session>
```
为兼容先前的用法，传入session时可使用相应session执行任务

不传入session时若存在文件`config.json`会读取相应的配置文件

若不存在`config.json`则会提示收到输入邮箱与密码
## 配置文件
`config.json`需手动创建。但仓库中提供一个模板`config.example.json`，内容如下
```JSONC
{
    /* 每次的游戏时长分钟数 */
    "defaultPlayTime": 45,   

    /* 当某账号出现错误时，true会跳过当前账号继续运行，false会终止运行并显示错误信息 */   
    "ignoreError": true,

    /* 请求失败后自动重试的次数 */
    "retryTimes": 5,

    /* 定时执行任务，需要提供CRON表达式
       若此项不存在，会立即执行一次任务并退出
       若此项存在，会根据对应的CRON表达式定时执行任务 
       如下面的 "10 * * *" 代表每天10:00执行一次
    */
    "schedule": "0 0 10 * * *",

    /* 需要批量执行的账号信息 */
    "accounts": [
        {
            "email": "123@abc.com",
            "password": "123456"
        },
        {
            "email": "233@abc.com",
            "password": "123456"
        },
        {
            "email": "114514@abc.com",
            "password": "123456"
        }
    ]
}
```