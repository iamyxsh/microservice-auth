use kafka::consumer::Consumer;

pub fn consume_messages(topic: String) -> Result<(), ()> {
    let connection = "localhost:29092".to_owned();
    let mut con = Consumer::from_hosts(vec![connection])
        .with_topic(topic)
        .create()
        .unwrap();

    loop {
        let mss = con.poll().unwrap();
        if mss.is_empty() {
            println!("No messages available right now.");
            return Ok(());
        }

        for ms in mss.iter() {
            for m in ms.messages() {
                println!(
                    "{}:{}@{}: {:?}",
                    ms.topic(),
                    ms.partition(),
                    m.offset,
                    m.value
                );
            }
            let _ = con.consume_messageset(ms);
        }
        con.commit_consumed().unwrap();
    }
}
