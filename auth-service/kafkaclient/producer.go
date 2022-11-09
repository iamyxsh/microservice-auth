package kafkaclient

import (
	"context"
	"fmt"

	"github.com/segmentio/kafka-go"
)

func Produce(topic string) {
	_, err := kafka.DialLeader(context.Background(), "tcp", "host.docker.internal:9092", "USER_LOGGED_IN", 0)
	if err != nil {
		panic(err.Error())
	}
	w := &kafka.Writer{
		Addr:     kafka.TCP("host.docker.internal:9092"),
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	}

	err = w.WriteMessages(context.Background(),
		kafka.Message{
			Key:   []byte("msg"),
			Value: []byte("user created"),
		},
	)

	if err != nil {
		fmt.Println(err.Error())
	}
}
