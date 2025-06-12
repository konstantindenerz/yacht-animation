#!/bin/bash

printf "\e[?25l"
printf "\e[1;1H\e[2J"

trap 'printf "\e[?25h"; exit' INT TERM EXIT

reverse_string() {
  local str="$1"
  local reversed=""
  local len=${#str}

  for ((i = len - 1; i >= 0; i--)); do
    local char="${str:$i:1}"
    case "$char" in
    "/") char="\\" ;;
    "\\") char="/" ;;
    "|") char="|" ;;
    "<") char=">" ;;
    ">") char="<" ;;
    esac
    reversed+="$char"
  done

  echo "$reversed"
}

draw_yacht() {
  local pos=$1
  local direction=$2
  local spaces=""
  local spaces2=""
  local output=""
  local terminal_width=80

  for ((i = 0; i < pos; i++)); do
    spaces+=" "
    spaces2+="  "
  done

  yacht_lines=(
    "                        "
    "         <<<|           "
    "           /|           "
    "          / |           "
    "         /  |\          "
    "        /   | \         "
    "       /____|  \        "
    "         ___|___\       "
    "  ______|_o_o_o_\______ "
    "  \__________________/  "
  )

  water_lines=(
    "~~~~~~~~~~~~^~~~~~^~~~~~~~~^~~~~~~~~~^~~~~~~~~~~~~~"
    "${spaces}    ^  ^^^     ^^    ^^^                  "
    "  ~~~   ~~~   ~~~   ~~~   ~~~   ~~~   ~~~          "
  )

  fish_line="  ^^  ~-^:>   ^ ^^ "

  for line in "${yacht_lines[@]}"; do
    local display_line=""
    if [[ "$direction" == "right" ]]; then
      display_line="${spaces}$(reverse_string "$line")"
    else
      display_line="${spaces}${line}"
    fi

    printf -v padded_line "%-${terminal_width}s" "$display_line"
    output+="${padded_line}\n"
  done

  for line in "${water_lines[@]}"; do
    printf -v padded_line "%-${terminal_width}s" "$line"
    output+="\033[34m${padded_line}\033[0m\n"
  done

  local fishline_line_f=""
  if [[ "$direction" == "right" ]]; then
    fish_line_f="${spaces2}$(reverse_string "$fish_line")"
  else
    fish_line_f="${spaces2}${fish_line}"
  fi

  printf -v padded_line "%-${terminal_width}s" "$fish_line_f"
  output+="\033[34m${padded_line}\033[0m\n"

  printf "$output"
}

while true; do
  for pos in {0..20}; do
    printf "\e[1;1H"
    draw_yacht $pos "left"
    sleep 0.2
  done

  for pos in {20..0}; do
    printf "\e[1;1H"
    draw_yacht $pos "right"
    sleep 0.2
  done
done
