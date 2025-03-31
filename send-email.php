<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);
    $to = "dholovni@gmail.com"; // Укажите вашу почту
    $from = "noreply@yourwebsite.com"; // Укажите отправителя (фиктивный email)
    
    // Формируем тело письма
    $email_body = "Subject: $subject\n\n";
    $email_body .= "Message:\n$message\n";
    
    // Заголовки письма
    $headers = "From: $from\r\n";
    $headers .= "Reply-To: $from\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Отправляем письмо
    if (mail($to, $subject, $email_body, $headers)) {
        echo json_encode(["status" => "success", "message" => "Message sent successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to send message."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>