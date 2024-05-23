# QangBot

QangBot is a comprehensive web application designed to make creating bots on various platforms effortless.

## Installation

### Clone the Repository

First, clone the repository to your local machine.

### Redis Server

Ensure that you have a Redis server running on your machine.

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd qangbot_front
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

3. Create two files named `.env` and `.env.local` with the following variables:
    ```env
    NEXT_PUBLIC_BACKEND_URL="http://127.0.0.1:8000"
    BACKEND_LOCAL_URL="http://127.0.0.1:8000"
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

### Backend Setup

1. Navigate to the backend directory:
    ```sh
    cd qangbot_back
    ```

2. Create a virtual environment:
    ```sh
    python -m venv venv
    ```

3. Activate the virtual environment (OS-specific command):
    - On Windows:
        ```sh
        .\venv\Scripts\activate
        ```
    - On macOS and Linux:
        ```sh
        source venv/bin/activate
        ```

4. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

5. Create a `.env` file with the following variables:
    ```env
    REDIS_URL=

    INTERNAL_HOST="127.0.0.1:8000"

    SECRET_KEY=

    EMAIL_HOST_PASSWORD=
    EMAIL_HOST_USER=
    EMAIL_HOST='smtp.gmail.com'
    EMAIL_PORT=587

    FRONT_HOST_HTTPS="http://127.0.0.1:3000"
    DOMAIN="127.0.0.1"

    DEFAULT_PROXY_USERNAME="username"
    DEFAULT_PROXY_PASSWORD="password"
    DEFAULT_PROXY_URL="155.***.***.41:38100"

    NONE_VIP_CREATION_LIMIT=2
    NONE_VIP_GRIDS_CREATION_LIMIT=100
    DEBUG=1
    ```

6. Apply migrations:
    ```sh
    python manage.py makemigrations
    python manage.py migrate
    ```

7. Create a superuser:
    ```sh
    python manage.py createsuperuser
    ```

8. Start the backend server:
    ```sh
    python manage.py runserver
    ```

### Bot Setup

1. Ensure the virtual environment is active:
    - On Windows:
        ```sh
        .\venv\Scripts\activate
        ```
    - On macOS and Linux:
        ```sh
        source venv/bin/activate
        ```

2. Navigate to the backend directory and run the bot grid manager:
    ```sh
    cd qangbot_back
    python manage.py gridbots
    ```

### Access the Application

Open your browser and navigate to `http://127.0.0.1:3000`. Log in with your superuser credentials to create your bots, add grids, and more. If you do not need to change or monitor anything, you can simply run:
```sh
python manage.py gridbots
