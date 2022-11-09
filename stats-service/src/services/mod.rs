use actix_web::{cookie::time::PrimitiveDateTime, get, web, Responder};
use serde::Serialize;
use sqlx::{Pool, Postgres};

mod stats;

pub struct AppState {
    pub db: Pool<Postgres>,
}

#[derive(Debug, Serialize)]
struct Res {
    pub last_login: String,
    pub login_counter: i32,
}

#[get("/stats/{email}")]
async fn get_stats(email: web::Path<String>, data: web::Data<AppState>) -> impl Responder {
    let pool = data.db.clone();

    let rec = sqlx::query!(
        r#"
             SELECT * FROM users WHERE email = $1"#,
        email.to_string()
    )
    .fetch_one(&pool)
    .await;

    let res = match rec {
        Ok(rec) => {
            let r = Res {
                last_login: rec.last_login.unwrap().date().to_string(),
                login_counter: rec.login_counter.unwrap(),
            };
            r
        }
        Err(err) => {
            println!("error - {}", err.to_string());
            let r = Res {
                last_login: "".to_string(),
                login_counter: 0,
            };
            r
        }
    };

    println!("{:?}", res);

    web::Json(res)
}
