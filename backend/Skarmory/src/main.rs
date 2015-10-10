#[macro_use] extern crate nickel;
extern crate Skarmory;

use std::io;
use std::io::prelude::*;
use std::fs::File;
use std::process::Command;

use nickel::{Nickel, HttpRouter};

fn index() -> String {
    "CLI Guide JS Server".to_string()
}

fn result_python(code :String) -> String {
    let byte: &[u8] = code.as_bytes();
    match create_file("hello_world.py", byte) {
        Ok(..) => println!("File created!"),
        Err(..) => println!("Error: could not create file.")
    }
    let mut python = Command::new("python").arg("hello_world.py").output().unwrap_or_else(|e| {
        panic!("failed to execute process: {}", e)
    });

    let result = String::from_utf8_lossy(&python.stdout);
    result.to_string()
}

fn create_file(filename: &'static str, string: &[u8]) -> io::Result<()> {
    let mut f = try!(File::create(filename));
    try!(f.write_all(string));
    Ok(())
}

fn main() {

    println!("Testing: {:?}", Skarmory::encode::value("%22".to_string()));

    let mut server = Nickel::new();

    server.get("/", middleware! { |request|
        index()
    });

    server.get("/python", middleware! { |request|
        result_python("print \"Hello, World!\"".to_string())
    });

    server.get("/python_interpreter/:code", middleware! { |request, response|
        let code = Skarmory::encode::value( request.param("code").unwrap().to_string() );
        println!("{:?}", code);
        result_python(code)
    });

    server.listen("127.0.0.1:6767");
}
