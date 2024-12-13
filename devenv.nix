{ pkgs, lib, config, inputs, ... }:

{
  packages = [
    pkgs.git
    pkgs.nodejs
  ];

  languages.go.enable = true;
  languages.typescript.enable = true;
}
