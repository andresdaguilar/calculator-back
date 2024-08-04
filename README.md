# Arithmetic Calculator REST API

## Project Description

The Arithmetic Calculator REST API is a web platform designed to provide simple calculator functionalities, including addition, subtraction, multiplication, division, square root calculation, and random string generation. Each functionality incurs a specific cost per request, which is deducted from the user's starting credit/balance. If a user's balance is insufficient to cover the request cost, the request will be denied.

This project consists of a RESTful API built using Express.js and a front-end UI application. Both applications are hosted live on a platform of choice and can be configured and used locally by other developers. Detailed instructions are provided to facilitate this setup.

## Key Features

- **Calculator Operations**: Addition, subtraction, multiplication, division, square root calculation, and random string generation.
- **User Balance Management**: Each user has a starting balance. Request costs are deducted from the user's balance.
- **Request Denial on Insufficient Balance**: Requests are denied if the user's balance is insufficient to cover the cost.
- **Live Deployment**: Both the API and UI are deployed live.
- **Local Setup Instructions**: Comprehensive instructions for local setup are provided.

## Design Decisions

### Choice of Express.js over NestJS

While NestJS offers a robust framework with extensive features, Express.js was chosen for this project due to its simplicity and ease of use. Express.js provides a straightforward approach to building RESTful APIs, making it an ideal choice for a project focused on essential calculator functionalities.

### Validation with Joi

Joi was implemented for data validation to ensure that incoming requests contain valid data. Joi provides a simple and powerful way to validate request payloads, contributing to the overall reliability and robustness of the API.

### Rate Limiting

A rate-limiting mechanism was implemented to prevent abuse of the API. This helps maintain the performance and availability of the service by limiting the number of requests a user can make within a specified time frame.

### Choice of PostgreSQL over MongoDB

PostgreSQL was chosen as the database for this project instead of MongoDB for several reasons:
- **ACID Compliance**: PostgreSQL provides strong consistency guarantees, which are crucial for managing financial transactions like user balances.
- **Relational Data Modeling**: The relational nature of PostgreSQL suits the structured data requirements of this project, including user records and balance management.

## Implementation Details

### Additional Column for `amount2`

An additional column, `amount2`, was added to the Records table to store both values of the operation. This ensures that operations requiring two input values (e.g., addition, subtraction, multiplication, division) are properly recorded and managed.

### Impact of Record Deletion

Deleting a record from a user's history does not affect the user's balance. This design decision ensures that the integrity of the user's balance is maintained, as balances are only affected by the actual execution of operations.

## API Documentation

### Postman Collection

A Postman collection is included to facilitate testing and exploration of the API. The collection contains pre-configured requests for all available endpoints, allowing developers to quickly interact with the API.

### Swagger Documentation

The API is documented using Swagger, providing an interactive interface for exploring the available endpoints, request parameters, and responses. The Swagger documentation is accessible at `/api-docs` on the live deployment.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Postman (optional, for API testing)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>

2. **Install Dependencies**:
    ```bash
  npm install