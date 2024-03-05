.globl main
.section .data
.text
main:
        pushq %rbp
        pushq %r12
        movq  %rsp, %rbp
        subq  $0, %rsp
        movl  $3, %eax
        movq  %rax, %r12
        movq  %r12, %rdi
        call  _readi
        movq  %rax, %r12
        movq  %r12, %rax
        movq  %rax, %rdi
        call  _printi
        call  _printn
        movq  $0, %rax
        addq  $4, %rsp
        movq  %rbp, %rsp
        popq  %r12
        popq  %rbp
        ret

_exit:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        call  exit@plt
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

.section .data
        .int 4
.prints_format:
        .asciz "%.*s"
.text
_prints:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        movq  %rdi, %rdx
        movl  -4(%rdi), %esi
        leaq  .prints_format(%rip), %rdi
        movb  $0, %al
        call  printf@plt
        movq  $0, %rdi
        call  fflush@plt
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

.section .data
        .int 2
.printi_format:
        .asciz "%d"
.text
_printi:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        movl  %edi, %esi
        leaq  .printi_format(%rip), %rdi
        movb  $0, %al
        call  printf@plt
        movq  $0, %rdi
        call  fflush@plt
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

.section .data
        .int 0
.printn_format:
        .asciz ""
.text
_printn:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        leaq  .printn_format(%rip), %rdi
        movb  $0, %al
        call  puts@plt
        movq  $0, %rdi
        call  fflush@plt
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

.section .data
        .int 2
.printc_format:
        .asciz "%c"
.text
_printc:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        movb  %dil, %sil
        leaq  .printc_format(%rip), %rdi
        movb  $0, %al
        call  printf@plt
        movq  $0, %rdi
        call  fflush@plt
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

.section .data
        .int 2
.printp_format:
        .asciz "%p"
.text
_printp:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        movq  %rdi, %rsi
        leaq  .printp_format(%rip), %rdi
        movb  $0, %al
        call  printf@plt
        movq  $0, %rdi
        call  fflush@plt
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

.section .data
        .int 4
.printb_true_lit:
        .asciz "true"
        .int 5
.printb_false_lit:
        .asciz "false"
.text
_printb:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        cmpb  $1, %dil
        je .printb_true
        leaq  .printb_false_lit(%rip), %rdi
        jmp   .printb_end
.printb_true:
        leaq  .printb_true_lit(%rip), %rdi
.printb_end:
        call  _prints
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

.section .data
        .int 3
.readi_format:
        .asciz " %d"
.text
_readi:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        subq  $16, %rsp
        movl  %edi, (%rsp)
        leaq  (%rsp), %rsi
        leaq  .readi_format(%rip), %rdi
        movb  $0, %al
        call  scanf@plt
        movslq (%rsp), %rax
        addq  $16, %rsp
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

.section .data
        .int 3
.readc_format:
        .asciz " %c"
.text
_readc:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        subq  $16, %rsp
        movb  %dil, (%rsp)
        leaq  (%rsp), %rsi
        leaq  .readc_format(%rip), %rdi
        movb  $0, %al
        call  scanf@plt
        movsbq (%rsp), %rax
        addq  $16, %rsp
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

_malloc:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        call  malloc@plt
        cmpq  $0, %rax
        je _errOutOfMemory
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

_free:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        call  free@plt
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

_freepair:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        andq   $-16, %rsp
        cmpq  $0, %rdi
        je _errNull
        call  free@plt
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

_arrStore1:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        cmpl  $0, %r10d
        cmovl %r10, %rsi
        jl _errOutOfBounds
        movl  -4(%r9), %ebx
        cmpl  %ebx, %r10d
        cmovge %r10, %rsi
        jge _errOutOfBounds
        movb  %al, (%r9, %r10)
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

_arrStore4:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        cmpl  $0, %r10d
        cmovl %r10, %rsi
        jl _errOutOfBounds
        movl  -4(%r9), %ebx
        cmpl  %ebx, %r10d
        cmovge %r10, %rsi
        jge _errOutOfBounds
        movl  %eax, (%r9, %r10, 4)
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

_arrStore8:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        cmpl  $0, %r10d
        cmovl %r10, %rsi
        jl _errOutOfBounds
        movl  -4(%r9), %ebx
        cmpl  %ebx, %r10d
        cmovge %r10, %rsi
        jge _errOutOfBounds
        movq  %rax, (%r9, %r10, 8)
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

_arrLoad1:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        cmpl  $0, %r10d
        cmovl %r10, %rsi
        jl _errOutOfBounds
        movl  -4(%r9), %ebx
        cmpl  %ebx, %r10d
        cmovge %r10, %rsi
        jge _errOutOfBounds
        movb  (%r9, %r10), %r9b
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

_arrLoad4:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        cmpl  $0, %r10d
        cmovl %r10, %rsi
        jl _errOutOfBounds
        movl  -4(%r9), %ebx
        cmpl  %ebx, %r10d
        cmovge %r10, %rsi
        jge _errOutOfBounds
        movl  (%r9, %r10, 4), %r9d
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

_arrLoad8:
        pushq %rbp
        movq  %rsp, %rbp
        subq  $0, %rsp
        cmpl  $0, %r10d
        cmovl %r10, %rsi
        jl _errOutOfBounds
        movl  -4(%r9), %ebx
        cmpl  %ebx, %r10d
        cmovge %r10, %rsi
        jge _errOutOfBounds
        movq  (%r9, %r10, 8), %r9
        addq  $0, %rsp
        movq  %rbp, %rsp
        popq  %rbp
        ret

.section .data
        .int 52
.errOverflow:
        .asciz "fatal error: integer overflow or underflow occurred\n"
.text
_errOverflow:
        addq  $-16, %rsp
        leaq  .errOverflow(%rip), %rdi
        call  _prints
        movb  $-1, %dil
        call  exit@plt
.section .data
        .int 40
.errDivZero:
        .asciz "fatal error: division or modulo by zero\n"
.text
_errDivZero:
        addq  $-16, %rsp
        leaq  .errDivZero(%rip), %rdi
        call  _prints
        movb  $-1, %dil
        call  exit@plt
.section .data
        .int 27
.errOutOfMemory:
        .asciz "fatal error: out of memory\n"
.text
_errOutOfMemory:
        addq  $-16, %rsp
        leaq  .errOutOfMemory(%rip), %rdi
        call  _prints
        movb  $-1, %dil
        call  exit@plt
.section .data
        .int 45
.errNull:
        .asciz "fatal error: null pair dereferenced or freed\n"
.text
_errNull:
        addq  $-16, %rsp
        leaq  .errNull(%rip), %rdi
        call  _prints
        movb  $-1, %dil
        call  exit@plt
.section .data
        .int 49
.errBadChar:
        .asciz "fatal error: int %d is not ascii character 0-127\n"
.text
_errBadChar:
        andq   $-16, %rsp
        leaq  .errBadChar(%rip), %rdi
        movb  $0, %al
        call  printf@plt
        movq  $0, %rdi
        call  fflush@plt
        movb  $-1, %dil
        call  exit@plt
.section .data
        .int 42
.errOutOfBounds:
        .asciz "fatal error: array index %d out of bounds\n"
.text
_errOutOfBounds:
        andq   $-16, %rsp
        leaq  .errOutOfBounds(%rip), %rdi
        movb  $0, %al
        call  printf@plt
        movq  $0, %rdi
        call  fflush@plt
        movb  $-1, %dil
        call  exit@plt
