#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(HealthKitManager, NSObject)

RCT_EXTERN_METHOD(checkAvailability:
                  (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCalories:(NSString *)date
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getWorkouts:(NSString *)date
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end 