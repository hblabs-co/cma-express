//
//  LoginViewController.swift
//  CMAOnboarding
//
//  Created by Helmer Luis Barcos Paso on 26.04.23.
//

import UIKit
import NotificationBannerSwift

class LoginViewController: UIViewController {
    
    @IBOutlet weak var loginButton: UIButton!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    
    @IBAction func loginButtonAction() {
        if (inputsAreValid()) {
            doLogin()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    
    private func inputsAreValid() -> Bool {
        guard let email = emailTextField.text, !email.isEmpty else {
            NotificationBanner(title: "Error", subtitle: "Debes introducir un dirección de correo electrónico", style: .warning).show()
            return false;
        }
        
        guard let password = passwordTextField.text, !password.isEmpty else {
            NotificationBanner(title: "Error", subtitle: "Debes introducir una contraseña", style: .warning).show()
            return false
        }
        
        return true
    }
    
    
    private func doLogin() {

        // Preparar la URL de autenticación
        let url = URL(string: "https://directus.hblabs.co/auth/login")!
        
        // Preparar el cuerpo de la solicitud
        let parameters = [
            "email": emailTextField.text,
            "password": passwordTextField.text
        ]
        
        let jsonData = try! JSONSerialization.data(withJSONObject: parameters, options: [])
       
        // Configurar la sesión HTTP
        let session = URLSession.shared
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = jsonData
        
        // Realizar la solicitud HTTP POST
        let task = session.dataTask(with: request) { data, response, error in
            if let error = error {
                DispatchQueue.main.async {
                    NotificationBanner(title: "Error", subtitle: "Login no fue posible. \(error.localizedDescription)", style: .danger).show()
                }

                return
            }
            
            if let httpResponse = response as? HTTPURLResponse {
                print("Codigo de estado HTTP: \(httpResponse.statusCode)")
            }
           
            guard let data = data else {
                DispatchQueue.main.async {
                    NotificationBanner(title: "Error", subtitle: "Login no fue posible. Directus unabailale", style: .danger).show()
                }
                return
            }
           
            // Analizar la respuesta JSON
            do {
                let json = try JSONSerialization.jsonObject(with: data, options: [])
                   // print("JSON completo: \(json)")
                if let jsonDict = json as? [String: Any],
                   let data = jsonDict["data"] as? [String: Any], let token = data["access_token"] as? String {
                 // Autenticación exitosa. Utiliza el token de autenticación para las solicitudes posteriores.
                 // print("Token de autenticación: \(token)")
                    // print("success \(token)")
                    
                    DispatchQueue.main.async {
                        NotificationBanner(title: "Success", subtitle: "Login correcto con token \(token)", style: .success).show()
                    }
                    
                    return

                } else {
                    DispatchQueue.main.async {
                        NotificationBanner(title: "Error", subtitle: "Login no fue posible. Error desconocido", style: .danger).show()
                    }
                    return
                }
            } catch let error {
                
                DispatchQueue.main.async {
                    NotificationBanner(title: "Error", subtitle: "Login no fue posible. Error desconocido", style: .danger).show()
                }
                
                print(error.localizedDescription)
                return
            }
        }
        
        task.resume()
    }
}
