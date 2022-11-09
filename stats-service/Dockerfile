FROM rust as planner
WORKDIR /usr/src/app
RUN cargo install cargo-chef
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM rust as cacher
WORKDIR /usr/src/app
RUN cargo install cargo-chef
COPY --from=planner /usr/src/app/recipe.json recipe.json
RUN cargo chef cook --recipe-path recipe.json

FROM rust as builder
WORKDIR /usr/src/app
COPY . .
COPY --from=cacher /usr/src/app/target target
COPY --from=cacher /usr/local/cargo /usr/local/cargo
RUN cargo install cargo-watch
# CMD ["cargo watch -x run"]

FROM gcr.io/distroless/cc-debian11
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/target/debug/stats-service /usr/src/app/
CMD [ "./stats-service" ]