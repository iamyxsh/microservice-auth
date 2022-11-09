package login

import (
	"bytes"
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"net/http/httptest"
	"testing"
)

func TestLoginRoute(t *testing.T) {
	tests := []struct {
		description  string
		route        string
		expectedCode int
	}{

		{
			description:  "check success login functionality",
			route:        "/login",
			expectedCode: 200,
		},
	}

	app := fiber.New()
 
	app.Post("/login", Login)

	// Iterate through test single test cases
	for _, test := range tests {
		// Create a new http request with the route from the test case
		var buf bytes.Buffer
		body := struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}{
			Email:    "yash@sharma.com",
			Password: "password",
		}

		json.NewEncoder(&buf).Encode(body)

		req := httptest.NewRequest("POST", test.route, &buf)
		resp, _ := app.Test(req, 1)

		assert.Equalf(t, test.expectedCode, resp.StatusCode, test.description)
	}
}
