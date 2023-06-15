<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>APDOC</title>
    <style>
        body {
            background: #18181b;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            padding: 0;
            margin: 0;
        }
        .body {
            background: #18181b;
            height: 800px;
        }
        .container {
            /* display: flex; */
            /* flex-direction: column; */
            justify-content: center;
            padding: 0 16px;
        }
        .logo {
            color: #34d399;
            font-weight: bold;
            font-size: 52px;
            margin: 52px auto 32px;
        }
        h1, p {
            color: white;
            margin: auto;
            padding-top: 16px;
            max-width: 580px;
            text-align: center;
        }
        h1 {
            padding-bottom: 16px;
        }
        p {
            color: #71717a;
        }
        .msg {
            padding: 0;
            color: #7c7c86;
            font-size: 16px;
        }
        .btn ,.btn a {
            text-decoration: none;
            background-color: #34d399;
            color: #18181b;
            margin: auto;
            border-radius: 6px;
            font-weight: bold;
        }
        .btn {
            display: flex;
            flex-direction: column;
            width: 180px;
            padding: 10px 20px;
            margin-top: 32px;
        }
        .btntext {
            font-size: 16px;
            color: #18181b;
        }
        .link {
            margin: 52px auto;
        }
        .linkverify {
            text-decoration: none;
            color: #0d9488;
        }
        .mainsvg {
            display: flex;
            margin: auto;
            align-items: center;
            /* padding: 16px; */
        }
        .bar {
            background-color: #34d399;
            height: 64px;
        }
    </style>
</head>
<body>
    <div class="body">
        <div class="bar"></div>
        <div class="container body">
            <h1 class="logo">APDOC</h1>
            <img src="https://i.postimg.cc/dtpBJNcV/lock-svgrepo-com.png" alt="email" width="128" class="mainsvg">
            <h1>Password Reset</h1>
            <p class="msg">If you've lost your password or wish to reset it,</p>
            <p class="msg">use the link below to get started.</p>
            <div class="btn">
                <a href="{{ env('APP_URL') }}/auth/changePassword?email={{$email}}&token={{$token}}" class="btntext">Change Password</a>
            </div>
            <p class="link">If you have trouble clicking the "Change Password" button, copy and paste url below into your web browser: <a href="{{ env('APP_URL') }}/auth/changePassword?email={{$email}}&token={{$token}}" target="_blank" class="linkverify">{{ env('APP_URL') }}/auth/changePassword?email={{$email}}&token={{$token}}</a></p>
        </div>
    </div>
</body>
</html>