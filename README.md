## 파이썬 TDD -> 타입스크립트 TDD, 마이그레이션 프로젝트 

> 타입스크립트(+ express, typeorm)를 이용한 TDD 웹 서버 개발에 빨리 적응하고자  
> 2018년도에 '클린 코드를 위한 테스트 주도 개발' 책을 스터디 하며 파이썬 장고로 작성했던   
> 실습 코드들을 타입스크립트 버전으로 옮겨보았습니다. 

<br/>

[개발환경 보기](https://portfolio-y0711.github.io/2020_tdd)

목차 

1. 동기 (Motivation)

2. 프로젝트를 진행하며 새롭게 습득하게 된 것들

3. 회 고 (Retrospective)

<br/>

### 1. 동기 (Motivation)

<!-- #region 1 -->

<details open>
<summary>...(닫기)</summary>

<br/>

🔥 **_마이그레이션 프로젝트_** 를 시작하게 된 **_주요 동기_**:   


* __애자일 하게 학습하기__: 학습과 관련하여 널리 알려진 사실은 **_피드백을 자주, 빨리, 많이 받을 수록 학습 효과가 향상된다_** 는 것입니다. 이와 관련하여 '클린 코드를 위한 테스트 주도 개발' 책으로 TDD 실습을 진행하며 Django 웹 프레임워크의 작동 방식이 효과적으로 이해되는 경험을 하기도 했습니다. 이에 타입스크립트 생태계에 좀 더 빠르게 적응하고자 의식적인 수련을 위한 학습도구로 TDD를 선택하고, 예전에 python TDD로 작성했던 코드들을 빠르게 타입스크립트 TDD로 옮겨보는 마이그레이션 프로젝트를 시작하게 되었습니다. 

* __비교를 통해 효과적으로 학습하기__: 학습 주제를 다른 주제와 **_비교하며 공부_** 하는 것은 대상을 비판적이고 분석적으로 바라보게 해주는 동시에, 학습에 대한 흥미를 지속적으로 유지하는 좋은 학습 방법이라 생각합니다. 동적 인터프리터 언어를 공부하면서 정적 컴파일 언어들에 대한 이해가 더욱 깊어지듯이, 대상을 **_낯설게 보기_** 위한 방법으로 웹 프레임워크 없는 환경에서의 Typescript와 Express를 Django 웹 프레임워크 환경에서의 Python 웹 애플리케이션과 비교하면서 공부하였습니다.

</details>

<br/>

<!-- [<<< 목차로 돌아가기]() -->

<!-- #endregion 1 -->

### 2. 프로젝트를 진행하며 새롭게 알게 된 것들  

<!-- #region 2 -->

<br/>

<details open>
<summary>..(전체닫기)</summary>

<br/>

🍀 프로젝트를 진행하는 과정 중에 습득한 **_기법들_** : 

* http request, response 객체를 Mocking하여 컨트롤러 테스트 하기 (suptertest 라이브러리 이용)

    <details open>
    <summary>..(닫기)</summary>

    * 모킹 라이브러리로 supertest, node-mocks-http, nock 등이 있었는데, Express와 함께 사용하기 좋은 supertest를 선택했습니다. 

    * supertest를 사용하기 위해서는 app모듈에서 서버 구동 코드 분리해야 하는데, 이렇게 분리하는 것이 graphql등과 같은 어댑터를 부가적으로 붙이거나 테스트 하기에도 좋습니다. 

    * 이후 미니 프로젝트에서 node router와 middleware를 런타임 바인딩 할 수 있는 함수형으로 작성하면 별도의 mocking 라이브러리 없이도 테스트가 가능하다는 것을 배웠습니다. 

    <br>

    ```ts
    import { app } from '../../../src/app';

    const request = require('supertest-session')(app);

    describe('ListViewTest', () => {
        describe('if_you_create_a_list_and_you_know_the_id_of_that_list', () => {
            let list_of_id_to_find: number;

            beforeEach(async (done) => {
                const correctList = await getRepository(List).save({});
                const { id } = correctList;
                list_of_id_to_find = Number(id);
                const itemRepo = getRepository(Item);
                await itemRepo.save({ text: '리스트_아이템1', list: correctList });
                await itemRepo.save({ text: '리스트_아이템2', list: correctList });
                done();
            })

            it('[GET /lists/:list_of_id_to_find] will_displays_only_items_for_that_list', async (done) => {
                request
                    .get(`/lists/${list_of_id_to_find}`)
                    .expect(200)
                    .then((res: any) => {
                        res.text.includes('리스트_아이템1').should.be.true();
                        res.text.includes('리스트_아이템2').should.be.true();
                        done();
                    })
                    .catch((e:any) => {
                        done(e);
                    })
            });
        })
    });

    ```

    <br>

    </details>

* 테스트 실행시 typeorm-mysql Db 객체 인스터스를 전역 컨텍스트로 공유하기 

    <details open>
    <summary>..(닫기)</summary>

    * jest 테스트 실행시 아래와 같은 설정을 통해 test db 인스턴스가 공유되도록 구성 가능합니다. 

    <br/>

    ```ts
    // 
    module.exports = {
        roots: ["<rootDir>/__tests__"],
        transform: {
        "^.+\\.tsx?$": "ts-jest",
        },
        testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
        testPathIgnorePatterns: ["/node_modules/"],
        globalSetup: "./src/test-utils/setup-db.ts",
        setupFilesAfterEnv: ["./src/test-utils/db-env.ts"],
    };

    //
    require("ts-node/register")
    require("tsconfig-paths/register")
    // import "dotenv/config"
    import { createConnection } from "typeorm"
    import { ConnectionOptions } from "typeorm"
    import { config } from "../../repositories/typeorm.config";

    export default (async () => {

    const testOrmConfig: ConnectionOptions = {
        ...(config as ConnectionOptions),
        dropSchema: true,
    }

    const t0 = Date.now()
    const connection = await createConnection(testOrmConfig)
    const connectTime = Date.now()
    await connection.runMigrations()
    const migrationTime = Date.now()
    console.log(
        ` 👩‍🔬 Connected in ${connectTime -
        t0}ms - Executed migrations in ${migrationTime - connectTime}ms.`
    )
    });

    ```

<br>

</details>

* Google Oauth2로 third-party 인증 서비스 사용하기 

    <details open>
    <summary>..(닫기)</summary>

    * 로그인 링크 생성시 nodemailer 사용을 검토하였으나, 학습 목적상 googleapi를 직접 사용하는 것이 바람직하다 생각하여 변경하였습니다. 

    <br/>

    ```ts
    // 
    import dotenv from 'dotenv';
    import { google } from 'googleapis';
    import { Oauth } from '../../src/models/oauth.entity';
    import { getRepository } from 'typeorm';

    dotenv.config();

    export const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
    );

    const scopes = [
        'https://mail.google.com'
    ];

    export const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    oauth2Client.on('tokens', async (tokens) => {
        const repo = getRepository(Oauth);
        const oauth = await repo.findOne('gmail_oauth');

        if (oauth) {
            oauth.access_token = tokens.access_token!;
            await repo.update(
                { service_name: 'gmail_oauth' },
                { access_token: tokens.access_token! }
            );
        } else {
            oauth2Client.setCredentials({
                refresh_token: tokens.refresh_token
            });
            await repo.save({
                service_name: 'gmail_oauth',
                access_token: tokens.access_token!,
                refresh_token: tokens.refresh_token!,
            });
        }
    });

    export const getToken = async (code: any) => {
        const { tokens } = await oauth2Client.getToken(code);
    };

    ```

<br>

</details>

* Dispatcher View 패턴과 Composite View 패턴 구현하기 (mustache 라이브러리 사용)

    <details open>
    <summary>..(닫기)</summary>

    * 

    <br/>

    ```ts
    // 

    import fs from 'fs';
    import mustache, { render } from 'mustache';
    import { Item } from '../models/item.entity';
    import { getRepository } from 'typeorm';

    const MustacheRenderer = (() => {
        const getRenderer = (viewPath: string, extName: string) =>
            (viewName: string, options: any) => {
                const filePath = viewPath + viewName + '.' + extName;
                const raw = fs.readFileSync(viewPath + viewName + '.' + extName).toString();
                return render(filePath, options);
            }
        const render = (filePath: string, options?: any) => {
            const raw = fs.readFileSync(filePath).toString();
            return mustache.render(raw, options);
        };
        return {
            render,
            getRenderer
        }
    })();

    const home_page: (options?: any) => Promise<string> = async (options?: any) => {
        return MustacheRenderer.render('./src/views/home.mu', options);
    }

    const view_list: (options?: any) => Promise<string> = async (options?: any) => {
        const repo = getRepository(Item);
        let idx = 1;
        options = Object.assign({}, options, { index: () => idx++ });
        return MustacheRenderer.render('./src/views/list.mu', options);
    };

    export { home_page, view_list }
    export { MustacheRenderer }


    .....

    ```

</details>

<br/>

* Docker-compose와 .env. dotenv로 개발용 database 컨테이너 생성을 간편하게 하기

    <details open>
    <summary>..(닫기)</summary>

    * .env로 docker cli 실행시 환경 파라미터를 외부화하고, dotenv 라이브러리로 관련 내용을 런타임 로딩하여 데이터 베이스 개발환경을 좀더 간편하게 유지할 수 있었습니다. 

    <br/>

    ```ts
    // 

    version: "3"
    services:
    mysql:
        environment: 
        - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
        - MYSQL_USER=${MYSQL_USER}
        - MYSQL_PASSWORD=${MYSQL_PASSWORD}
        - MYSQL_PORT=${MYSQL_PORT}
        - MYSQL_DATABASE={MYSQL_DATABASE}
        container_name: my_mysql
        image: mysql:5.7
        command: ['mysqld', '--character-set-server=utf8mb4', '--collation-server=utf8mb4_unicode_ci']
        volumes:
        - /var/lib/docker/volumes/v_mysql/_data:/var/lib/mysql
        ports: 
        - ${MYSQL_PORT}:3306
        env_file: 
        - .env

    // .env

    MYSQL_ROOT_PASSWORD=<password>
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USER=<userid>
    MYSQL_PASSWORD=<password>
    MYSQL_DATABASE=db
    PORT=5000

    CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
    CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
    REDIRECT_URL=http://localhost:5000/oauth/callback

    ADMIN_PASSWORD=<admin_password>

    JWT_SECRET=xxxxxxxxxx

    # mailer settings
    GMAIL_ACCOUNT=portfolio.y0711@gmail.com

    ```

</details>

</details>

<br/>

<!-- #endregion 2 -->

### 3. 회 고 (Retrospective)

<!-- #region 3 -->

<br/>

<details open>
<summary>..(닫기)</summary>

<br/>

︎︎︎︎✨︎ 프로젝트를 진행하면서 깨닫게 된 **_주관적인 경험_** : 

* 웹 프레임워크를 잘 활용하기 위해서는 웹 프레임워크 없이 개발을 해보아야 한다.

* 테스트 코드를 작성하면서 점진적으로 개발해 나가는 방식이 결과적으로 개발 속도를 높이는 최선의 선택이다. 

* 기존 프로젝트에 새로운 기능을 추가할 때는 예광탄 개발을 먼저 진행하자.

<br>

<br>

︎︎︎🌻︎ 다음 **_미니 프로젝트_** 를 통해  **_시도해 보고 싶은 것들_** : 

* 웹 프레임워크 환경에서 TDD 실천하기 

* 타입 safe하지 않은 JS 환경에서 TDD 실천하기 

</details>

<br>

<br>

<!-- #endregion 5 -->

