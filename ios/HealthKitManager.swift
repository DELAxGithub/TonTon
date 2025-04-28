import Foundation
import HealthKit

@objc(HealthKitManager)
class HealthKitManager: NSObject {
  private let healthStore = HKHealthStore()
  private let calendar = Calendar.current
  
  // 必要なHealthKitの型を定義
  private let typesToRead: Set<HKSampleType> = [
    HKQuantityType(.activeEnergyBurned),
    HKQuantityType(.basalEnergyBurned),
    HKWorkoutType()
  ]
  
  // HealthKitの利用可否をチェック
  @objc
  func checkAvailability(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard HKHealthStore.isHealthDataAvailable() else {
      reject("ERROR", "HealthKit is not available", nil)
      return
    }
    
    healthStore.requestAuthorization(toShare: nil, read: typesToRead) { success, error in
      if let error = error {
        reject("ERROR", "Failed to request HealthKit authorization: \(error.localizedDescription)", error)
        return
      }
      
      if success {
        resolve(true)
      } else {
        reject("ERROR", "HealthKit authorization was denied", nil)
      }
    }
  }
  
  // 指定日の消費カロリーを取得
  @objc
  func getCalories(_ date: String,
                   resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let targetDate = ISO8601DateFormatter().date(from: date + "T00:00:00Z") else {
      reject("ERROR", "Invalid date format", nil)
      return
    }
    
    let startDate = calendar.startOfDay(for: targetDate)
    let endDate = calendar.date(byAdding: .day, value: 1, to: startDate)!
    
    let activeType = HKQuantityType(.activeEnergyBurned)
    let basalType = HKQuantityType(.basalEnergyBurned)
    
    let group = DispatchGroup()
    var activeCalories: Double = 0
    var basalCalories: Double = 0
    var errorOccurred: Error?
    
    // アクティブカロリーの取得
    group.enter()
    let activeQuery = HKStatisticsQuery(
      quantityType: activeType,
      quantitySamplePredicate: HKQuery.predicateForSamples(
        withStart: startDate,
        end: endDate,
        options: .strictStartDate
      ),
      options: .cumulativeSum
    ) { _, result, error in
      defer { group.leave() }
      
      if let error = error {
        errorOccurred = error
        return
      }
      
      if let sum = result?.sumQuantity() {
        activeCalories = sum.doubleValue(for: .kilocalorie())
      }
    }
    
    // 基礎代謝カロリーの取得
    group.enter()
    let basalQuery = HKStatisticsQuery(
      quantityType: basalType,
      quantitySamplePredicate: HKQuery.predicateForSamples(
        withStart: startDate,
        end: endDate,
        options: .strictStartDate
      ),
      options: .cumulativeSum
    ) { _, result, error in
      defer { group.leave() }
      
      if let error = error {
        errorOccurred = error
        return
      }
      
      if let sum = result?.sumQuantity() {
        basalCalories = sum.doubleValue(for: .kilocalorie())
      }
    }
    
    healthStore.execute(activeQuery)
    healthStore.execute(basalQuery)
    
    group.notify(queue: .main) {
      if let error = errorOccurred {
        reject("ERROR", "Failed to fetch calories: \(error.localizedDescription)", error)
        return
      }
      
      let result: [String: Any] = [
        "activeCalories": activeCalories,
        "basalCalories": basalCalories,
        "totalCalories": activeCalories + basalCalories
      ]
      
      resolve(result)
    }
  }
  
  // 指定日のワークアウトデータを取得
  @objc
  func getWorkouts(_ date: String,
                   resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let targetDate = ISO8601DateFormatter().date(from: date + "T00:00:00Z") else {
      reject("ERROR", "Invalid date format", nil)
      return
    }
    
    let startDate = calendar.startOfDay(for: targetDate)
    let endDate = calendar.date(byAdding: .day, value: 1, to: startDate)!
    
    let predicate = HKQuery.predicateForSamples(
      withStart: startDate,
      end: endDate,
      options: .strictStartDate
    )
    
    let query = HKSampleQuery(
      sampleType: HKWorkoutType(),
      predicate: predicate,
      limit: HKObjectQueryNoLimit,
      sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: true)]
    ) { _, samples, error in
      if let error = error {
        reject("ERROR", "Failed to fetch workouts: \(error.localizedDescription)", error)
        return
      }
      
      guard let workouts = samples as? [HKWorkout] else {
        resolve([])
        return
      }
      
      let workoutData = workouts.map { workout -> [String: Any] in
        let duration = workout.duration
        let calories = workout.totalEnergyBurned?.doubleValue(for: .kilocalorie()) ?? 0
        
        return [
          "type": workout.workoutActivityType.name,
          "duration": Int(duration / 60), // 分単位に変換
          "calories": calories,
          "startDate": ISO8601DateFormatter().string(from: workout.startDate),
          "endDate": ISO8601DateFormatter().string(from: workout.endDate)
        ]
      }
      
      resolve(workoutData)
    }
    
    healthStore.execute(query)
  }
}

// ワークアウトタイプの名前を取得する拡張
extension HKWorkoutActivityType {
  var name: String {
    switch self {
    case .running: return "ランニング"
    case .walking: return "ウォーキング"
    case .cycling: return "サイクリング"
    case .swimming: return "水泳"
    case .hiking: return "ハイキング"
    case .yoga: return "ヨガ"
    case .traditionalStrengthTraining: return "筋トレ"
    default: return "その他"
    }
  }
} 