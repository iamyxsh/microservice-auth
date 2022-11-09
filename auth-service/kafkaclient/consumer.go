package kafkaclient

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/iamyxsh/microservice-auth/auth-service/models"
	"github.com/segmentio/kafka-go"
)

//[]string{"host.docker.internal:9092"},

func Consume(topic string) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   []string{"host.docker.internal:9092"},
		Topic:     "USER_CREATED",
		Partition: 0,
		MinBytes:  10e3, // 10KB
		MaxBytes:  10e6, // 10MB
	})

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			fmt.Println(err.Error())
			continue
		}
		var user models.User
		u := struct {
			Email    string
			Password string
		}{Email: "", Password: ""}

		fmt.Println(m.Value)

		err = json.Unmarshal(m.Value, &u)
		if err != nil {
			fmt.Println(err.Error())
			continue
		}

		user.Email = u.Email
		user.Password = u.Password

		user.Create()

		fmt.Printf(user.Email, user.Password)
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
	}
}
