function Header(props: { title: string; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void }) {
    return (
        <header>
            <h1>{props.title}</h1>
            <button onClick={props.onClick}>Click me</button>
        </header>
    );
}

export default Header;