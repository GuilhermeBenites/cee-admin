# Database Design

This document describes the data model for the Church Sales Counter system.

```mermaid
erDiagram
    SALES {
        int id PK
        string client_name
        datetime date
        int user_id FK
        decimal total
        string payment_method
    }

    SALE_ITEMS {
        int id PK
        int sale_id FK
        int product_id FK
        int member_id FK nullable
        decimal value
    }

    PRODUCTS {
        int id PK
        string name
        string type
    }

    MEMBERS {
        int id PK
        string name
    }

    MONTHLY_FEE_MONTHS {
        int id PK
        int sale_item_id FK
        int month
        int year
    }

    USERS {
        int id PK
        string name
        string email
        string password
        string role
    }

    SALES ||--o{ SALE_ITEMS : "has"
    SALE_ITEMS ||--o{ MONTHLY_FEE_MONTHS : "can register"
    SALE_ITEMS }o--|| PRODUCTS : "refers to"
    SALE_ITEMS }o--|| MEMBERS : "can belong to"
    SALES }o--|| USERS : "registered by"
```
