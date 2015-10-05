use regex::Regex;

pub fn value(mut value :String) -> String {
    //https://en.wikipedia.org/wiki/ASCII
    let space = Regex::new(r"%20").unwrap();
    let ex_mark = Regex::new(r"%21").unwrap(); // !
    let qua_mark = Regex::new(r"%22").unwrap(); // ""
    let number = Regex::new(r"%23").unwrap(); // #
    let dollar = Regex::new(r"%24").unwrap(); // $
    let percent = Regex::new(r"%25").unwrap(); // %
    let ampersand = Regex::new(r"%26").unwrap(); // &
    let apostrophe = Regex::new(r"%27").unwrap(); // ''
    let parentheses1 = Regex::new(r"%28").unwrap(); // (
    let parentheses2 = Regex::new(r"%29").unwrap(); // )

    let after = space.replace_all(&*value, " ");
    let after = ex_mark.replace_all(&*after, "!");
    let after = qua_mark.replace_all(&*after, "\"");
    let after = number.replace_all(&*after, "#");
    let after = dollar.replace_all(&*after, "$");
    let after = percent.replace_all(&*after, "%");
    let after = ampersand.replace_all(&*after, "&");
    let after = apostrophe.replace_all(&*after, "\'");
    let after = parentheses1.replace_all(&*after, "(");
    let after = parentheses2.replace_all(&*after, ")");

    after.to_string()

}
