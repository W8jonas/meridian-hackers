; ModuleID = 'probe8.9d0448b46baa2d41-cgu.0'
source_filename = "probe8.9d0448b46baa2d41-cgu.0"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-i128:128-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

; core::f64::<impl f64>::to_ne_bytes
; Function Attrs: inlinehint nounwind
define internal void @"_ZN4core3f6421_$LT$impl$u20$f64$GT$11to_ne_bytes17hd4393621416d6a4aE"(ptr sret([8 x i8]) align 1 %_0, double %self) unnamed_addr #0 {
start:
  store double %self, ptr %_0, align 1
  ret void
}

; probe8::probe
; Function Attrs: nounwind
define dso_local void @_ZN6probe85probe17h76c0f7eb977177b9E() unnamed_addr #1 {
start:
  %_1 = alloca [8 x i8], align 1
; call core::f64::<impl f64>::to_ne_bytes
  call void @"_ZN4core3f6421_$LT$impl$u20$f64$GT$11to_ne_bytes17hd4393621416d6a4aE"(ptr sret([8 x i8]) align 1 %_1, double 3.140000e+00) #2
  ret void
}

attributes #0 = { inlinehint nounwind "target-cpu"="mvp" "target-features"="+mutable-globals" }
attributes #1 = { nounwind "target-cpu"="mvp" "target-features"="+mutable-globals" }
attributes #2 = { nounwind }

!llvm.ident = !{!0}

!0 = !{!"rustc version 1.88.0 (6b00bc388 2025-06-23)"}
