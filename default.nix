{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "astro-blog";
  src = pkgs.lib.cleanSource ./.;

  buildInputs = [ pkgs.nodejs-16_x pkgs.nodePackages.npm ];

  buildPhase = ''
    npm install
    npm run build
  '';

  installPhase = ''
    mkdir -p $out
    cp -R * $out/
  '';
}
